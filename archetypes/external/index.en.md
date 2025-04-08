+++
title = "{{ replace .Name "-" " " | title }}"
date = '{{ .Date }}'
description = "{{ replace .Name "-" " " | title }}"
summary = "{{ replace .Name "-" " " | title }}"
# Categories are generally used for broader, top-level topics.
categories = [
 'external',
 'digitization',
 'business',
 'home',
 'website',
 'iot',
 'networking',
 'smart home',
 'computer',
]
# Tags are used for more specific, detailed topics.
tags = [
 'hugo',
 'internet appearance',
 'static websites',
 'themes',
 'website design',
 'business networking'
 'home networking',
 'backup',
 'nat',
 'home assistant',
 'internet of things',
 'access point',
 'fibre',
 'internet',
 'router',
 'wifi',
 'wired networking',
 'zigbee',
 'energy',
 'lighting',
 'plants',
 'solar',
 'linux',
 'mac',
 'windows',
 'maintenance',
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
