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
    ('Director', 75000, 1),
    ('Manager', 50000, 2),
    ('Associate', 35000, 3),
    ('Assistant', 20000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
    ('Seve', 'Barrutia', 1, NULL),
    ('Robert', 'Parsons', 2, 1),
    ('Maria', 'DeBeer', 3, 1),
    ('Julie', 'Martin', 4, 1);