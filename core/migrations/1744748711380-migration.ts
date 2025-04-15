import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744748711380 implements MigrationInterface {
    name = 'Migration1744748711380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog"."categories" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog"."comments" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" text NOT NULL, "articleId" bigint, "commentsId" bigint, "authorId" bigint, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."profile" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "birthday" date, "avatar" character varying, "cover" character varying, "bio" text, "userId" bigint, CONSTRAINT "UQ_0046bf0859cceb5f1744df2a360" UNIQUE ("name"), CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog"."tags" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."users" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog"."articles" ("id" BIGSERIAL NOT NULL, "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "content" text NOT NULL, "cover" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "categoryId" bigint, "authorId" bigint, CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog"."article_tag" ("tagsId" bigint NOT NULL, "articlesId" bigint NOT NULL, CONSTRAINT "PK_34bc674e6954b1ebd4dde23f514" PRIMARY KEY ("tagsId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_912dd59780963197fa706fc8ca" ON "blog"."article_tag" ("tagsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_53575455ffd659146f8274eab8" ON "blog"."article_tag" ("articlesId") `);
        await queryRunner.query(`CREATE TABLE "auth"."user_following" ("followerId" bigint NOT NULL, "followingId" bigint NOT NULL, CONSTRAINT "PK_4c29c3c6063e27a589692e45853" PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a2dce8d9c1c4b5cbc8d6e5fc39" ON "auth"."user_following" ("followerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b88ad49e84034c506d3c0ae742" ON "auth"."user_following" ("followingId") `);
        await queryRunner.query(`CREATE TABLE "blog"."articles_tags_tags" ("articlesId" bigint NOT NULL, "tagsId" bigint NOT NULL, CONSTRAINT "PK_bee9492f5e2157b6dc27fd510bd" PRIMARY KEY ("articlesId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0adb8d108330d74e4a7f7d29de" ON "blog"."articles_tags_tags" ("articlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dcd523dc6473a35e6cb0cbf9f2" ON "blog"."articles_tags_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "blog"."comments" ADD CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f" FOREIGN KEY ("articleId") REFERENCES "blog"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog"."comments" ADD CONSTRAINT "FK_9a786030b14a0f4d59a16bf48bb" FOREIGN KEY ("commentsId") REFERENCES "blog"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog"."comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "auth"."profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog"."articles" ADD CONSTRAINT "FK_9cf383b5c60045a773ddced7f23" FOREIGN KEY ("categoryId") REFERENCES "blog"."categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog"."articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog"."article_tag" ADD CONSTRAINT "FK_912dd59780963197fa706fc8ca1" FOREIGN KEY ("tagsId") REFERENCES "blog"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog"."article_tag" ADD CONSTRAINT "FK_53575455ffd659146f8274eab85" FOREIGN KEY ("articlesId") REFERENCES "blog"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "auth"."user_following" ADD CONSTRAINT "FK_a2dce8d9c1c4b5cbc8d6e5fc399" FOREIGN KEY ("followerId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "auth"."user_following" ADD CONSTRAINT "FK_b88ad49e84034c506d3c0ae7422" FOREIGN KEY ("followingId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog"."articles_tags_tags" ADD CONSTRAINT "FK_0adb8d108330d74e4a7f7d29de2" FOREIGN KEY ("articlesId") REFERENCES "blog"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog"."articles_tags_tags" ADD CONSTRAINT "FK_dcd523dc6473a35e6cb0cbf9f2d" FOREIGN KEY ("tagsId") REFERENCES "blog"."tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog"."articles_tags_tags" DROP CONSTRAINT "FK_dcd523dc6473a35e6cb0cbf9f2d"`);
        await queryRunner.query(`ALTER TABLE "blog"."articles_tags_tags" DROP CONSTRAINT "FK_0adb8d108330d74e4a7f7d29de2"`);
        await queryRunner.query(`ALTER TABLE "auth"."user_following" DROP CONSTRAINT "FK_b88ad49e84034c506d3c0ae7422"`);
        await queryRunner.query(`ALTER TABLE "auth"."user_following" DROP CONSTRAINT "FK_a2dce8d9c1c4b5cbc8d6e5fc399"`);
        await queryRunner.query(`ALTER TABLE "blog"."article_tag" DROP CONSTRAINT "FK_53575455ffd659146f8274eab85"`);
        await queryRunner.query(`ALTER TABLE "blog"."article_tag" DROP CONSTRAINT "FK_912dd59780963197fa706fc8ca1"`);
        await queryRunner.query(`ALTER TABLE "blog"."articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "blog"."articles" DROP CONSTRAINT "FK_9cf383b5c60045a773ddced7f23"`);
        await queryRunner.query(`ALTER TABLE "auth"."profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "blog"."comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`ALTER TABLE "blog"."comments" DROP CONSTRAINT "FK_9a786030b14a0f4d59a16bf48bb"`);
        await queryRunner.query(`ALTER TABLE "blog"."comments" DROP CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f"`);
        await queryRunner.query(`DROP INDEX "blog"."IDX_dcd523dc6473a35e6cb0cbf9f2"`);
        await queryRunner.query(`DROP INDEX "blog"."IDX_0adb8d108330d74e4a7f7d29de"`);
        await queryRunner.query(`DROP TABLE "blog"."articles_tags_tags"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_b88ad49e84034c506d3c0ae742"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_a2dce8d9c1c4b5cbc8d6e5fc39"`);
        await queryRunner.query(`DROP TABLE "auth"."user_following"`);
        await queryRunner.query(`DROP INDEX "blog"."IDX_53575455ffd659146f8274eab8"`);
        await queryRunner.query(`DROP INDEX "blog"."IDX_912dd59780963197fa706fc8ca"`);
        await queryRunner.query(`DROP TABLE "blog"."article_tag"`);
        await queryRunner.query(`DROP TABLE "blog"."articles"`);
        await queryRunner.query(`DROP TABLE "auth"."users"`);
        await queryRunner.query(`DROP TABLE "blog"."tags"`);
        await queryRunner.query(`DROP TABLE "auth"."profile"`);
        await queryRunner.query(`DROP TABLE "blog"."comments"`);
        await queryRunner.query(`DROP TABLE "blog"."categories"`);
    }

}
