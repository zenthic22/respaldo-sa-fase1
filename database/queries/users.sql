use user_db;

INSERT INTO roles (name, description)
VALUES
  ('ADMIN', 'Administrador del sistema'),
  ('USER', 'Usuario estándar');

select * from roles;
select * from user_roles;
select * from users;
select * from subscriptions;

select * from promotions;
select * from promotion_assignments;
select * from user_affinities;

select * from users;
select * from report_actions;
select * from user_reports;

select * from profiles;
select * from subscription_payments;

select * from user_affinities;

drop database user_db;