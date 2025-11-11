map $request_body $dg_leak {
    default 0;
    "~*($DG_REAL_NAME_REGEX)" 1;
}
map $query_string $dg_leak_qs {
    default 0;
    "~*($DG_REAL_NAME_REGEX)" 1;
}

server {
    listen 80;

    if ($dg_leak) { return 400; }
    if ($dg_leak_qs) { return 400; }

    sub_filter_once off;
    sub_filter_types application/json text/html text/plain;
    sub_filter '$DG_REAL_NAME_LITERAL' '$DG_PSEUDONYM';

    location / {
        proxy_pass http://app:8000;
    }
}
