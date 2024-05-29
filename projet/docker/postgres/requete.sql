CREATE TEMP TABLE temp_json (
                                data JSONB
);

-- Load JSON data into the temporary table (you can adjust the path to your JSON file)
COPY temp_json (data) FROM 'users.json';

-- Insert data into users table
INSERT INTO projet.users (username, enabled, firstName, lastName, email)
SELECT
    user_data->>'username',
    (user_data->>'enabled')::BOOLEAN,
    user_data->>'firstName',
    user_data->>'lastName',
    user_data->>'email'
FROM
    temp_json,
    jsonb_array_elements(data->'users') AS user_data;

-- Insert data into roles table
INSERT INTO projet.roles (username, role)
SELECT
    user_data->>'username',
    role
FROM
    temp_json,
    jsonb_array_elements(data->'users') AS user_data,
    jsonb_array_elements_text(user_data->'realmRoles') AS role;

-- Insert data into credentials table
INSERT INTO projet.credentials (username, temporary, type, value)
SELECT
    user_data->>'username',
    (credential->>'temporary')::BOOLEAN,
    credential->>'type',
    credential->>'value'
FROM
    temp_json,
    jsonb_array_elements(data->'users') AS user_data,
    jsonb_array_elements(user_data->'credentials') AS credential;