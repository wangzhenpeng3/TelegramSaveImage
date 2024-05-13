## docker run --rm -it <镜像名> bash 进入镜像
## docker rmi -f  <镜像名>  强行删除镜像
## docker run --rm -it <镜像名> 这个命令会启动一个容器，容器中会执行 CMD 指定的命令
## docker run -it <镜像名> /bin/sh 你可以启动一个基于你的镜像的临时容器，并进入一个交互式的 shell，比如 /bin/bash 或 /bin/sh，来查看文件。
## docker 推送 
docker tag telegram-save-imag:1.0.0 wzp1741219625272/telegram-save-imag:1.0.0
这个命令会创建一个指向你本地镜像 telegram-save-imag:1.0.0 的新标签，其名称为 wzp1741219625272/telegram-save-imag:1.0.0，这样就符合 Docker Hub 的要求。
docker push wzp1741219625272/telegram-save-imag:1.0.0
这个命令会将标记为 wzp1741219625272/telegram-save-imag:1.0.0 的镜像上传到你的 Docker Hub 账户下。