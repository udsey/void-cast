CREATE OR REPLACE FUNCTION cleanup_old_casts()
RETURNS void AS $$
DECLARE
  limit_count integer := 100000; --LIMIT_COUNT
BEGIN
  DELETE FROM public.casts 
  WHERE id NOT IN (
    SELECT id FROM public.casts 
    ORDER BY id DESC 
    LIMIT limit_count
  );
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule(
  'cleanup-casts',
  '*0 * * * *',
  $$SELECT cleanup_old_casts();$$
);