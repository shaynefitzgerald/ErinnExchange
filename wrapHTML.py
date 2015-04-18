with open('F:\\MabiMarket\\UITemplateSandbox.html', 'r+') as f:
	content = f.readlines()
	output = []
	for x in range(len(content)):
		output.append('"' + content[x][0:len(content[x])-1] + '",\n')
	output[0] = "[" + output[0]
	output[len(output) - 1] += "]"
	for item in output:
	  f.write("%s" % item)