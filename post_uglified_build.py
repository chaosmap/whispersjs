import json

# Publish the whispersjs tag and also place the tag into the demo template
with open('src/shorthand/uglified/whispers.js', 'r') as wspr:
	inline_tag_contents = 'wspr=(%s)();'%wspr.read()[11:-1]

with open('whispersjs_tag.html', 'w') as wspr_tag:
	wspr_tag.write('<script type="text/javascript">%s</script>'%inline_tag_contents)

for read_file_path, write_file_path in [
	('demo/templates/demo_template.html', 'demo/demo.html'),
	('src/tests_template.html', 'src/tests.html'),
	('src/shorthand/tests_template.html', 'src/shorthand/tests.html'),
	('src/shorthand/uglified/tests_template.html', 'src/shorthand/uglified/tests.html')
]:
	with open(read_file_path, 'r') as read_template, open(write_file_path, 'w') as output:
		output.write(
			read_template.read().replace('// PUT_INLINE_WHISPERSJS_LIBRARY_HERE', inline_tag_contents)
		)

# Publish the whispers_plus js
with open('src/shorthand/uglified/whispers_plus.js', 'r') as r, open('whispers_plus.js', 'w') as w:
	w.write(r.read())