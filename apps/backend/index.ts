import app from "./app.ts";
import "./db/index.ts";

const key =
  "-----BEGIN PRIVATE KEY-----\n" +
  "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDNV7SfOUcrw65m\n" +
  "LHnf6USNmqQh7x/pyhGO5MgYsuFJfQHOmeVKcCICDIVvo0MVplBbhVJAR1S0BckV\n" +
  "hSLca6IKyBCFEuPCjVB44+h7stT0Jnvf2WPxoXIKQMCVPKd3XCAYsOeSHQnMUAqQ\n" +
  "dxj9uCTtYiCBJqxd6YtNuDeLV0cT/Txa7DpZFR/DoW9mc1FCxruXlV/MoQZd0Ca8\n" +
  "1QFe6OqQVEsPZKkb5E/jIDm2GP34pSqZN/BVg9Z1t7lYorpRaXGIZ82SptLHTazb\n" +
  "lUR50IDDoc4iCuhU7HSIuUZklLiIzbuedIV/QWdmrl1FohHCO2W8nHPcyDY7q3V3\n" +
  "SMQLVP55AgMBAAECggEBAMfOYcjVGTWykM6G1IhWGQiYwsDqR2lb4D3ky/eMh77U\n" +
  "Tp/UC9KkzdKkkGqSuEImtOZ5EhHN1tPdFU9FXyiP6vsGtVxnhwvWKcmYKq3C04hG\n" +
  "sh6dD60c5TSo0Tvl6yYvlGOyL4Jzkwclk0IDQWQQfI4n/2zsTqiLCau0ZwfFAzqk\n" +
  "Xjq1peLrx+sCh2gpZpe6EvrfJ/aG9QZBQfbmNrKqq2Zf+LHSTI19jhjUeAlRiY5M\n" +
  "iacW4YUNKVXeDobFSmRiE80EyAQdHWMBNiYDCtU5KA9Z9Nt7/aA6a1nb/WS1LFOX\n" +
  "rWNHvsPfwR1sJpihSQFpZp86rmJlt5KXD/UD5AoTSiECgYEA7p/1G56MKIjLyxVZ\n" +
  "38UPQONb6+2x9Y4bsbA5zMVdAG9dX/pU+xNqfxdkiw0JtQuW2rwu8zcqtQJMc/x2\n" +
  "pSqPffN1uObVc/FPE+qT0uN09OE2BU1tcQ2jXA3aAdJdPuJFgKrkB5eWpVgTrzQh\n" +
  "O6RNcUrUbYs2/+yyNL1dMw+rjQ0CgYEA3EtbUVcbZpARKoY7KVbauR/h/a/4KgZt\n" +
  "rpdmfVh/0qXw4FUciFKKpU9dKcJ290oNwhdnGbvQuhde44yaXL8RiuOiU3QFU8Fw\n" +
  "MWumTgbHFGm/Ts1eorzeL2KagwI9s5FNyMkKABQKWHkPzgcx14sSdkCfm+ZdljQx\n" +
  "4txQ/6clFB0CgYEAym+tEsdIhEK5EQqF+k5FCHlZTCeUZ4std2rXPh7ZLTtM7dWD\n" +
  "LpVkLXl89HIVICA61En9UpwkgPb4QRWW2bvni6R05G3/+6JlwbGpwqjwWaaNm6X6\n" +
  "CITXZ4rgvdbnACgZanSPitlRFehImsQQxXY3tLsUx/HosOjurctQO7c5hCkCgYBO\n" +
  "3HcrTjiT5b0PcRAaw2n3Xa+EJot7V+PJ3Y8mDhlsKlVpqW5Wat4RQbEDMwdtjUgR\n" +
  "lFknQDH/fEBOy1WzH/9Criy9HUqO6i+ksXnOcuSvrQ98QU7AiUYsxmqzvYijEMA8\n" +
  "waNf1czCUUxUIAU6uSF5zbaVk8kq7TJymRYx/v7qDQKBgQCFhITeTJ61hinGotI6\n" +
  "luB2UF9nru6roSY9hwRCGepG7vvHTMAH80zjirGPJx+Ki5pMDc+rWcyB5VgbjYdL\n" +
  "lWZ86MgZum+6Z535SWMUgRy/4rXpqgbZrPigjTF9yJSTXqlXpAd/xI3Mf/IJnsjB\n" +
  "K9oE7BSVv+4IXaIiK2qwKfRrYQ==\n" +
  "-----END PRIVATE KEY-----";

const cert =
  "-----BEGIN CERTIFICATE-----\n" +
  "MIIERTCCAq2gAwIBAgIRAIM64mvRIFh/cPrX4S6rjwEwDQYJKoZIhvcNAQELBQAw\n" +
  "eTEeMBwGA1UEChMVbWtjZXJ0IGRldmVsb3BtZW50IENBMScwJQYDVQQLDB5qYW5l\n" +
  "a296Z2FASmFuZWtzLU1CUC5mcml0ei5ib3gxLjAsBgNVBAMMJW1rY2VydCBqYW5l\n" +
  "a296Z2FASmFuZWtzLU1CUC5mcml0ei5ib3gwHhcNMjUwMjA4MTUwNzE3WhcNMjcw\n" +
  "NTA4MTQwNzE3WjBjMScwJQYDVQQKEx5ta2NlcnQgZGV2ZWxvcG1lbnQgY2VydGlm\n" +
  "aWNhdGUxODA2BgNVBAsML2phbmVrb3pnYUBKYW5la3MtTWFjQm9vay1Qcm8ubG9j\n" +
  "YWwgKEphbmVrIE96Z2EpMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\n" +
  "zVe0nzlHK8OuZix53+lEjZqkIe8f6coRjuTIGLLhSX0BzpnlSnAiAgyFb6NDFaZQ\n" +
  "W4VSQEdUtAXJFYUi3GuiCsgQhRLjwo1QeOPoe7LU9CZ739lj8aFyCkDAlTynd1wg\n" +
  "GLDnkh0JzFAKkHcY/bgk7WIggSasXemLTbg3i1dHE/08Wuw6WRUfw6FvZnNRQsa7\n" +
  "l5VfzKEGXdAmvNUBXujqkFRLD2SpG+RP4yA5thj9+KUqmTfwVYPWdbe5WKK6UWlx\n" +
  "iGfNkqbSx02s25VEedCAw6HOIgroVOx0iLlGZJS4iM27nnSFf0FnZq5dRaIRwjtl\n" +
  "vJxz3Mg2O6t1d0jEC1T+eQIDAQABo14wXDAOBgNVHQ8BAf8EBAMCBaAwEwYDVR0l\n" +
  "BAwwCgYIKwYBBQUHAwEwHwYDVR0jBBgwFoAURmh4a3/Rl/+nh3+eofbEFBK57Ucw\n" +
  "FAYDVR0RBA0wC4IJbG9jYWxob3N0MA0GCSqGSIb3DQEBCwUAA4IBgQA3Qcs6EVcz\n" +
  "zuCU5fRwxLmAgUocVKoR8VKzmp0qHtoKhErqFod/7JkI5zaMuVgoExqq50GCOk6E\n" +
  "a9MnwSH5qOU94nU4Sr/8SvEYZIG7EMGv5nOgRfSjtaDbSKP/NcuyKK0CTjG4B/+s\n" +
  "5iHT6rkTf90RO+kiJEomczjZeyH5iNOc8fljmdJJg2YjI5GCX+RZZpQVUp/WsGcC\n" +
  "mCLUdkrSgTEN7d4CHpfq31OeGeXqLa5tgrhxhaD5xi1jcQCSdEcZJXjsxP+0++Gu\n" +
  "Szk4umHyEY97YvTwM3IIVTspO3V5IzcaTuYYmI4bjbidaRiWfnq4jUTmqbaiDTVO\n" +
  "yJDLcLjDOX+Rnj6icKR14v4yX847cF4St7Xpy+NCha7wCZuoFo+CJWoh+FXAYpMe\n" +
  "nBS6Pi+AFySLrREnWTiMLUk/+hHDpNzGpM1G3pxptt+hSLAbQNXwi6mMkhWeKwbG\n" +
  "3v94qIVh3EyKkpGScN6BGs7OJPbun7CD7ONHzCXj5+zo5Lyy6r6ej+A=\n" +
  "-----END CERTIFICATE-----\n";
Deno.serve(
  {
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
    // cert: cert,
    // key: key,
  },
  app.fetch,
);
