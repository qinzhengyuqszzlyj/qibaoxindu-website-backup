from selenium import webdriver  
from selenium.webdriver.common.by import By  
from selenium.webdriver.support.ui import WebDriverWait  
from selenium.webdriver.support import expected_conditions as EC  
  
# 启动Chrome浏览器  
driver = webdriver.Chrome()  # 确保ChromeDriver的路径已配置  
  
# 打开网页  
driver.get('https://app.rainyun.com/auth/login')  
  
# 等待元素加载  
wait = WebDriverWait(driver, 10)  
  
# 用户名输入框  
username_input = wait.until(EC.element_to_be_clickable((By.ID, 'field')))  
username_input.send_keys('qinzhengyu')  
  
# 密码输入框  
password_input = wait.until(EC.element_to_be_clickable((By.ID, '__BVID__51')))  
password_input.send_keys('Zxx771200')  
  
# 登录按钮  
login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"]')))  
login_button.click()  
  
# 等待登录完成（这里可能需要额外的逻辑来检测登录是否成功，例如检查某个元素是否存在）  
# ...  
  
# 前往积分商城页面  
driver.get('https://app.rainyun.com/account/reward/store')  # 假设登录后可以直接访问  
  
# 等待并点击赚取积分按钮  
earn_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[href="/account/reward/earn"]')))  
earn_button.click()  
  
# 等待并点击领取奖励按钮（这里假设页面加载完成后，按钮即可点击）  
reward_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[href="/account/reward/earn#"]')))  
reward_button.click()  
  
# 关闭浏览器（如果需要的话）  
driver.quit()