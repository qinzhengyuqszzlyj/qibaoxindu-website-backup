import os

def remove_urls(file_path):
    # 定义要移除的 URL
    urls_to_remove = [
        "https://qbxd.mhedu.sh.cn/",
        "http://qbxd.mhedu.sh.cn/"
    ]
    
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 移除指定的 URL
    for url in urls_to_remove:
        content = content.replace(url, '')
    
    # 将修改后的内容写回文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

def process_files_in_directory(directory):
    # 遍历目录中的所有文件
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.css', '.js')):
                file_path = os.path.join(root, file)
                remove_urls(file_path)
                print(f"Processed {file_path}")

# 获取当前目录
current_directory = os.getcwd()

# 处理当前目录中的所有文件
process_files_in_directory(current_directory)
