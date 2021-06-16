use employeesDB;

INSERT INTO departments(dept_name)
VALUES
    ('Product'),
    ('Engineering'),
    ('Marketing'),
    ('HR'),
    ('Finance');

INSERT INTO roles(job_title, salary, dept_id)
VALUES
    ('Director', 10000000, 1),
    ('Manager', 9999999, 1),
    ('Associate', 10, 3),
    ('Assistant', 10, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
    ('Seve', 'Barrutia', 1, NULL),
    ('Robert', 'Parsons', 2, 1),
    ('Maria', 'DeBeer', 3, 1),
    ('Julie', 'Martin', 4, 1);