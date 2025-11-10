CREATE TABLE "resetPasswordVerificationToke" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "resetPasswordVerificationToke_id_token_pk" PRIMARY KEY("id","token")
);
