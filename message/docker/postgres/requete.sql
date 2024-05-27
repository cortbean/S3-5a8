set search_path to app;

SELECT * FROM message LIMIT 10;

INSERT INTO app.usager (cip)
SELECT DISTINCT cip
FROM app.message
ON CONFLICT (cip) DO NOTHING;

SELECT DISTINCT cip
FROM app.message;



