--- create database senhas;

--- use senhas;

Create table posts (
	id_post  int(11) unsigned not null auto_increment,
	title varchar(80) not null, 
    content varchar(1024) not null,
	published datetime not null,
    id_user int(10) unsigned not null,
    user varchar(45) not null,
    primary key(id_post)
    );              

describe users;
select * from users;

--- drop table usuarios;usersusers

describe posts;
delete from posts where id_post=1;