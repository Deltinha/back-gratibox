CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "addresses" (
	"id" serial NOT NULL,
	"address" varchar(255) NOT NULL,
	"recipient" varchar(255) NOT NULL,
	"cep" varchar(8) NOT NULL,
	"city" varchar(255) NOT NULL,
	"state_id" integer NOT NULL,
	CONSTRAINT "addresses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "subscriptions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"subscription_date" TIMESTAMP NOT NULL DEFAULT 'now()',
	"address_id" integer NOT NULL,
	"delivery_day_id" integer NOT NULL,
	CONSTRAINT "subscriptions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products_subscriptions" (
	"id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"subscription_id" integer NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "states" (
	"id" serial NOT NULL UNIQUE,
	"name" varchar(2) NOT NULL UNIQUE,
	CONSTRAINT "states_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "delivery_days" (
	"id" serial NOT NULL,
	"day" integer NOT NULL,
	"plan_id" integer NOT NULL,
	CONSTRAINT "delivery_days_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "plans" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk0" FOREIGN KEY ("state_id") REFERENCES "states"("id");

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk1" FOREIGN KEY ("address_id") REFERENCES "addresses"("id");
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk2" FOREIGN KEY ("delivery_day_id") REFERENCES "delivery_days"("id");


ALTER TABLE "products_subscriptions" ADD CONSTRAINT "products_subscriptions_fk0" FOREIGN KEY ("product_id") REFERENCES "products"("id");
ALTER TABLE "products_subscriptions" ADD CONSTRAINT "products_subscriptions_fk1" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id");


ALTER TABLE "delivery_days" ADD CONSTRAINT "delivery_days_fk0" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");


ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");










