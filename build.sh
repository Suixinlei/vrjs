#!/usr/bin/env bash
# build.sh <envType>
# please run build.sh add envType

BASE_DIR=${PWD}

echo "------------- build.sh start, pwd: ${PWD}, envType: $1, appname: ${APP_NAME}, baseDir: ${BASE_DIR} at $(date +%Y/%m/%d\ %H:%M:%S) ------------"
# tnpm i --production || exit $?

# 执行 tnpm run build 来进行应用自定义的构建
echo "[node-scripts] start custom build: tnpm run build... at $(date +%Y/%m/%d\ %H:%M:%S) "
BUILD_ERROR=0
BUILD_OUTPUT=`tnpm run build 2>&1` || BUILD_ERROR=1
if [[ $BUILD_ERROR -eq 1 ]]
  then
  if [[ $BUILD_OUTPUT != *"missing script: build"* ]]
    then
    echo "$BUILD_OUTPUT"
    echo "[node-scripts] custom build error! please check your npm build script! at $(date +%Y/%m/%d\ %H:%M:%S) "
    exit 1
  else
    echo "[node-scripts] npm build script not exist, skip custom build. at $(date +%Y/%m/%d\ %H:%M:%S) "
  fi
else
  echo "$BUILD_OUTPUT"
  echo "[node-scripts] custom build success!"
fi


# 执行webpack,得到打包后的js以及css
echo "[node-scripts] start webpack build: webpack... at $(date +%Y/%m/%d\ %H:%M:%S) "
BUILD_ERROR=0
BUILD_OUTPUT=`node_modules/.bin/webpack` || BUILD_ERROR=1
if [[ $BUILD_ERROR -eq 1 ]]
    then
    echo "$BUILD_OUTPUT"
    echo "[node-scripts] webpack build error! at $(date +%Y/%m/%d\ %H:%M:%S) "
    exit 1
else
    echo "$BUILD_OUTPUT"
    echo "[node-scripts] webpack build success!"
fi

#移动所有的html文件以及build下面的js文件至pub文件夹下
if [ ! -e pub ]
    then
    mkdir pub
fi
cp -f *.html pub
cp -rf build pub
cp -rf resource pub

#压缩整个文件夹并发送至kele系统
ZIP_OUTPUT=`cd pub && zip -r $(date +%Y-%m-%d_%H:%M:%S).zip ./* && mv *.zip ../`
echo "$ZIP_OUTPUT"

echo "[node-scripts] build success! at $(date +%Y/%m/%d\ %H:%M:%S) "