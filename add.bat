@echo off  
setlocal  
  
:: 切换到你的仓库目录（如果需要的话）  
:: cd /d "I:\新建文件夹 (3)\qibaoxindu-website-backup"  
  
:: 添加所有修改的文件到暂存区  
git add .  
  
:: 提交暂存区的文件到本地仓库（请替换<your-commit-message>为你的提交信息）  
set /p COMMIT_MESSAGE="Enter commit message: "  
git commit -m "%COMMIT_MESSAGE%"  
  
:: 检查上次提交是否成功  
if %errorlevel% neq 0 (  
    echo Commit failed!  
    pause  
    exit /b %errorlevel%  
)  
  
:: 将本地仓库的改动推送到远程仓库（假设你已经在GitHub上设置了SSH密钥或配置了凭据）  
git push origin main  :: 注意：如果你的默认分支不是main，请使用正确的分支名，如master  
  
:: 检查推送是否成功  
if %errorlevel% neq 0 (  
    echo Push failed!  
    pause  
    exit /b %errorlevel%  
)  
  
echo Commit and push successful!  
pause  
endlocal