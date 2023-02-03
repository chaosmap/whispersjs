import json

source_files = [
	'whispers.js',
	'whispers_plus.js.template'
]

test_files = [
	'tests.html',
	'test_para.html'
]

with open('src/shorthand/name_map.json', 'r') as fp:
	vmr = fp.read()
	var_map = json.loads(vmr)



for filename in source_files + test_files:

	with open('src/%s'%filename, 'r') as orig, open('src/shorthand/%s'%filename, 'w') as short:
		mapped = orig.read()
		for key, val in var_map.items():
			mapped = mapped.replace(key, val)
		short.write(
			mapped
		)

for path in [
	'/',
	'/shorthand/',
	# '/shorthand/uglified'
]:
	with open('src%swhispers_plus.js.template'%path, 'r') as plus_r, open('src%swhispers_plus.js'%path, 'w') as plus_w:
		plus_w.write(plus_r.read().replace('// PUT_INLINE_WHISPERSJS_SHORTHAND_NAME_MAP_HERE', vmr))

for filename in test_files + ['whispers_plus.js', 'name_map.json']:

	with open('src/shorthand/%s'%filename, 'r') as orig, open('src/shorthand/uglified/%s'%filename, 'w') as short:
		short.write(
			orig.read()
		)

for filename in ['whispers_plus.js', 'name_map.json']:
	with open('src/shorthand/%s'%filename, 'r') as orig, open('demo/%s'%filename, 'w') as short:
		short.write(
			orig.read()
		)

with open('src/shorthand/uglified/whispers.js', 'r') as wspr:
	inline_tag_contents = 'wspr=(%s)();'%wspr.read()[11:-1]

	with open('whispersjs_tag.html', 'w') as wspr_tag:
		wspr_tag.write('<script type="text/javascript">%s</script>'%inline_tag_contents)

	with open('demo/templates/demo_template.html', 'r') as demo_template, open('demo/demo.html', 'w') as demo_output:
		demo_output.write(
			demo_template.read().replace('// PUT_INLINE_WHISPERSJS_LIBRARY_HERE', inline_tag_contents)
		)

with open('src/shorthand/uglified/whispers_plus.js', 'r') as r, open('whispers_plus.js', 'w') as w:
	w.write(r.read())