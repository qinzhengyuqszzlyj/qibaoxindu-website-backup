import os  
  
def generate_html_index(folder_path='./', output_file='index.html'):  
    # 初始化HTML内容  
    html_content = '''  
    <!DOCTYPE html>  
    <html lang="en">  
    <head>  
        <meta charset="UTF-8">  
        <meta name="viewport" content="width=device-width, initial-scale=1.0">  
        <title>索引</title>  
    </head>  
    <body>  
        <h1>文件索引</h1>  
        <ul>  
    '''  
  
    # 遍历文件夹中的文件和子文件夹  
    for root, dirs, files in os.walk(folder_path):  
        for file in files:  
            # 构建文件的相对路径（从当前文件夹开始）  
            relative_path = os.path.relpath(os.path.join(root, file), folder_path)  
            # 添加文件到HTML列表  
            html_content += f'            <li><a href="{relative_path}">{relative_path}</a></li>\n'  
  
    # 结束HTML列表和body、html标签  
    html_content += '''  
        </ul>  
    </body>  
    </html>  
    '''  
  
    # 将HTML内容写入文件  
    with open(output_file, 'w', encoding='utf-8') as f:  
        f.write(html_content)  
  
    print(f'HTML索引已生成并保存到：{output_file}')  
  
# 调用函数生成HTML索引  
generate_html_index()