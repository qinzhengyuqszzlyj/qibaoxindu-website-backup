@echo off  
setlocal  
  
:: 设置你的仓库路径（根据实际情况修改）  
set REPO_PATH=I:\新建文件夹 (3)\qibaoxindu-website-backup
  
:: 切换到你的仓库目录  
cd /d "%REPO_PATH%"  
  
:: 添加所有修改的文件到暂存区（你可以使用 git add <file> 来指定文件）  
git add .  
  
:: 提交暂存区的文件到本地仓库（请替换 <your-commit-message> 为你的提交信息）  
git commit -m "自动提交"  
  
:: 将本地仓库的改动推送到远程仓库（请替换 <your-username> 和 <your-password> 或使用 SSH 密钥）  
:: 注意：使用用户名和密码在命令行中是不安全的，建议使用 SSH 密钥或凭据助手  
git push origin master  
  
endlocal