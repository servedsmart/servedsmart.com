+++
date = '{{ .Date }}'
lastmod = '{{ .Date }}'
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
description = '{{ replace .File.ContentBaseName "-" " " | title }}'
summary = '{{ replace .File.ContentBaseName "-" " " | title }}'
layout = 'single'
# Categories are generally used for broader, top-level topics.
categories = []
# Tags are used for more specific, detailed topics.
tags = []
# Keywords are used for metadata and SEO purposes.
keywords = []
+++
