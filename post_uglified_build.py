import json

# Publish the whispersjs tag and also place the tag into the demo template
with open('src/shorthand/uglified/whispers.js', 'r') as wspr:
	inline_tag_contents = 'wspr=(%s)();'%wspr.read()[11:-1]

	with open('whispersjs_tag.html', 'w') as wspr_tag:
		wspr_tag.write('<script type="text/javascript">%s</script>'%inline_tag_contents)

	with open('demo/templates/demo_template.html', 'r') as demo_template, open('demo/demo.html', 'w') as demo_output:
		demo_output.write(
			demo_template.read().replace('// PUT_INLINE_WHISPERSJS_LIBRARY_HERE', inline_tag_contents)
		)

# Publish the whispers_plus js
with open('src/shorthand/uglified/whispers_plus.js', 'r') as r, open('whispers_plus.js', 'w') as w:
	w.write(r.read())