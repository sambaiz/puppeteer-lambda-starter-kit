FROM amazonlinux:2017.03.1.20170812
RUN yum install -y aws-cli
RUN yum groupinstall -y 'Development Tools'
RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
RUN yum -y install nodejs-6.10.3
ADD ./.aws /root/.aws
RUN npm install serverless -g
WORKDIR /start-kit