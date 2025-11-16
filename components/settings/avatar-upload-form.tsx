"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadButton } from "@/app/api/uploadthing/uploadthing";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { profileUpdateImage } from "@/server/actions/settings";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { avatarSchema } from "@/types/settings-schema";

type AvatarUploadFormProps = {
  image: string | null;
  name: string;
  email: string;
};

const AvatarUploadForm = ({ image, name, email }: AvatarUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      image: image ?? "",
      email,
    },
  });

  const { execute, status } = useAction(profileUpdateImage, {
    onSuccess: ({ data }) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) toast.success(data.success);
    },
  });

  return (
    <Form {...form}>
      <FormField
        name="image"
        control={form.control}
        render={({ field }) => (
          <FormItem className="space-y-4">
            <div className="flex items-center flex-col gap-4">
              <Avatar className="w-14 h-14">
                {field.value ? (
                  <AvatarImage src={field.value} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-primary text-white font-bold">
                    {name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col">
                <UploadButton
                  className="ut-button:bg-primary hover:ut-button:bg-primary/90 ut-button:text-primary-foreground"
                  endpoint="imageUploader"
                  onUploadBegin={() => setIsUploading(true)}
                  onUploadError={(error) => {
                    form.setError("image", {
                      type: "validate",
                      message: error.message,
                    });
                    setIsUploading(false);
                  }}
                  content={{
                    button({ ready }) {
                      if (status === "executing") {
                        return <div>Saving...</div>;
                      }
                      if (isUploading) {
                        return <div>Uploading...</div>;
                      }
                      return ready ? (
                        <div>Upload Avatar</div>
                      ) : (
                        <div>Loading Uploader...</div>
                      );
                    },
                  }}
                  onClientUploadComplete={(res) => {
                    const imageUrl = res[0].url;

                    form.setValue("image", imageUrl, { shouldDirty: false });

                    execute({ image: imageUrl, email: email });

                    setIsUploading(false);
                  }}
                />
                <FormMessage />
              </div>
            </div>

            <FormControl>
              <Input type="hidden" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
};

export default AvatarUploadForm;
