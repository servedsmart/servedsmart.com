+++
title = "{{ replace .Name "-" " " | title }}"
date = '{{ .Date }}'
description = "{{ replace .Name "-" " " | title }}"
summary = "{{ replace .Name "-" " " | title }}"
# Categories are generally used for broader, top-level topics.
categories = [
 'extern',
 'digitalisierung',
 'unternehmen',
 'heimkunden',
 'website',
 'iot',
 'netzwerke',
 'smart home',
 'computer',
]
# Tags are used for more specific, detailed topics.
tags = [
 'hugo',
 'internetauftritt',
 'statische websites',
 'themes',
 'website design',
 'unternehmensnetzwerk',
 'heimnetzwerk',
 'backup',
 'nat',
 'home assistant',
 'internet of things',
 'access point',
 'glasfaser',
 'internet',
 'router',
 'wifi',
 'wlan',
 'kabelnetzwerk',
 'zigbee',
 'energie',
 'licht',
 'pflanzen',
 'solar',
 'linux',
 'mac',
 'windows',
 'wartung',
]
# Remove this to publish.
draft = true
# External URL specific parameters
externalUrl = ""
showReadingTime = false
[_build]
render = "false"
list = "local"
+++
