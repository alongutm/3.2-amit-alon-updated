-- DROP TABLE users;


CREATE TABLE [dbo].[users](
	[user_id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL default NEWID(),
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](300) NOT NULL,
    [firstName] [varchar](30) NOT NULL,
    [lastName] [varchar](30) NOT NULL,
    [country] [varchar](30) NOT NULL,
    [email] [varchar](30) NOT NULL,
    [profile_pic][varchar](300) NOT NULL

SELECT * FROM users
