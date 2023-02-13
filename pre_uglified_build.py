import json


test_files = [
	'tests.html',
	# 'test_para.html'
]

# Load the shorthand template into whispers_plus
with open('src/shorthand/name_map.json', 'r') as fp:
	vmr = fp.read()
	var_map = json.loads(vmr)

	with open('src/whispers_plus.template.js', 'r') as plus_r, open('src/whispers_plus.js', 'w') as plus_w:
		# template will be used in a bit
		whispers_plus_template = plus_r.read()
		# persist the template to the main whispers_plus file so it can be picked up and shorthanded
		plus_w.write(whispers_plus_template)


template_pattern = '// PUT_INLINE_WHISPERSJS_SHORTHAND_NAME_MAP_HERE'

# Create shorthand copies for the shorthand directory
for filename in ['whispers.js', 'whispers_plus.js'] + test_files:
		
	with open('src/%s'%filename, 'r') as orig, open('src/shorthand/%s'%filename, 'w') as shorthand:

		mapped = orig.read()
		for key, val in var_map.items():
			mapped = mapped.replace(key, val)
		shorthand.write(
			# add in the shorthand name map
			mapped.replace(template_pattern, vmr)
		)

# Use template from earlier as base for the mapping to be added to the template pattern and to save the result
with open('src/whispers_plus.js', 'w') as verbose:
	verbose_var_map = {}
	for key in var_map.keys():
		verbose_var_map[key] = key
	verbose_var_map = json.dumps(verbose_var_map)
	verbose.write(
		# add in the verbose name map for the verbose directory
		# this will just map a name to its self instead of a shorthand
		whispers_plus_template.replace(template_pattern, verbose_var_map)
	)

# Copy over files that are not uglified but needed in the uglified directory
for filename in test_files + ['whispers_plus.js', 'name_map.json']:

	with open('src/shorthand/%s'%filename, 'r') as orig, open('src/shorthand/uglified/%s'%filename, 'w') as short:
		short.write(
			orig.read()
		)

# Also to the demo directory (no tests needed)
with open('src/shorthand/whispers_plus.js', 'r') as orig, open('demo/whispers_plus.js', 'w') as short:
	short.write(
		orig.read()
	)