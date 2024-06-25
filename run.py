import subprocess  
import os  
  
def initialize_git_repo(repo_path):  
    """初始化Git仓库"""  
    if not os.path.exists(os.path.join(repo_path, '.git')):  
        subprocess.run(['git', 'init'], cwd=repo_path, check=True)  
  
def add_all_files(repo_path):  
    """添加所有文件到暂存区"""  
    subprocess.run(['git', 'add', '.'], cwd=repo_path, check=True)  
  
def commit_changes(repo_path, message):  
    """提交更改"""  
    subprocess.run(['git', 'commit', '-m', message], cwd=repo_path, check=True)  
  
def set_remote_origin(repo_path, remote_url):  
    """设置远程仓库的URL"""  
    # 检查是否已经设置了远程仓库  
    result = subprocess.run(['git', 'remote', '-v'], cwd=repo_path, stdout=subprocess.PIPE, text=True, check=True)  
    if 'origin' not in result.stdout:  
        subprocess.run(['git', 'remote', 'add', 'origin', remote_url], cwd=repo_path, check=True)  
  
def push_to_remote(repo_path, branch='master'):  
    """推送到远程仓库"""  
    subprocess.run(['git', 'push', '-u', 'origin', branch], cwd=repo_path, check=True)  
  
# 使用示例  
repo_path = 'D:\GitHub\qibaoxindu-website-backup'  # 替换为你的仓库路径  
remote_url = 'https://github.com/qinzhengyuqszzlyj/qibaoxindu-website-backup'  # 替换为你的GitHub仓库URL 
commit_message = 'Automated commit from Python script'  
  
initialize_git_repo(repo_path)  # 如果仓库已经存在，则不需要此步骤  
add_all_files(repo_path)  
commit_changes(repo_path, commit_message)  
set_remote_origin(repo_path, remote_url)  # 如果已经设置了远程仓库，则不需要此步骤  
push_to_remote(repo_path)