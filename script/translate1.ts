import * as fs from 'fs-extra';

const configJson = './translate.json';
const sourceDirectory = '../source/adoc'; // 原始文件目录
const targetDirectory = '../source/adoc'; // 输出文件目录

function replaceText(config: any, type: string, fileText: string) {
  let newFileType = fileText;
  if ('regex' === type) {
    for (let regex of config.regex) {
      let split = regex.split('%%%');
      for (let i = 1; i < split.length; i++) {
        newFileType = newFileType.replace(new RegExp(split[i], 'g'), split[0]);
      }
    }
  }
  if ('character' === type) {
    for (let regex of config.character) {
      let split = regex.split('%%%');
      for (let i = 1; i < split.length; i++) {
        newFileType = newFileType.replaceAll(split[i], split[0]);
      }
    }
  }
  return newFileType;
}

function translate() {
  try {
    const jsonObject = fs.readJsonSync(configJson);
    const files = fs.readdirSync(sourceDirectory);
    for (let file of files) {
      if (!file.endsWith('.adoc')) continue;
      // fs.read;
      const fileText = fs.readFileSync(`${sourceDirectory}/${file}`, 'utf8');
      let newFileText = replaceText(jsonObject, 'regex', fileText);
      newFileText = replaceText(jsonObject, 'character', newFileText);
      fs.outputFileSync(`${targetDirectory}/${file}`, newFileText, 'utf8');
    }
  } catch (e) {
    console.error('发生错误:', e);
  }
}

translate();
