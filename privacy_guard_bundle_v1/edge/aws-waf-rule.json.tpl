{
  "Name": "BlockDGLeaks",
  "Priority": 10,
  "Statement": {
    "RegexMatchStatement": {
      "FieldToMatch": { "AllQueryArguments": {} },
      "TextTransformations": [{ "Priority": 0, "Type": "LOWERCASE" }],
      "RegexString": ".*($DG_REAL_NAME_REGEX_LOWER).*"
    }
  },
  "Action": { "Block": {} },
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "waf-block-dg"
  }
}
