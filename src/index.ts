import fs from 'fs';
import path from 'path';

export interface DependencyType {
    [key: string]: string;
}

export interface Package {
    dependencies: DependencyType;
    devDependencies: DependencyType;
}

export interface ConfigOption {
    outPutFileName: string;
    packageJsonFile: string;
    showNpmLinkColumn: boolean;
    showTypeColumn: boolean;
    showDependencies: boolean;
    showDevDependencies: boolean;
    htmlId: string;
    header: string;
    isLogOuputEnabled: boolean;
    islogOuputMsgEnabled: boolean;
    logMessage: string;
}

const appDir: string = path.resolve('./');
const packageJsonFilePath: string = path.join(appDir, 'package.json');
const npmBaseLink: string = 'https://www.npmjs.com/package/';
const base: string = ' | ';

let packageJsonFile = fs.readFileSync(packageJsonFilePath, 'utf-8');
let outputString: string = '';
let outPutFileName: string = 'README.md';
let htmlId: string = 'htmlId';
let header: string = '## Package List';
let showNpmLinkColumn: boolean = true;
let showTypeColumn: boolean = true;
let showDependencies: boolean = true;
let showDevDependencies: boolean = true;
let isLogOuputEnabled: boolean = false;
let islogOuputMsgEnabled: boolean = true;
let logMessage: string = `✅ Package list has been updated in the 🚩 ${outPutFileName} file.`;
let columns: string[] = ['Package Name', 'Version'];

const generateTable = ({
    obj,
    type,
    showTypeColumn,
    showNpmLinkColumn
}: {
    obj: DependencyType;
    type: string;
    showTypeColumn: boolean;
    showNpmLinkColumn: boolean;
}) => {
    let str = '';
    const base = ' | ';
    for (let row in obj) {
        str +=
            base +
            row +
            base +
            obj[row] +
            base +
            (showTypeColumn ? type + base : '') +
            (showNpmLinkColumn ? `[${row}](${npmBaseLink}${row})` + base : '') +
            '\n';
    }

    return str;
};

export const generateTableMarkDown = async (markDownfile: string, option?: ConfigOption) => {
    outPutFileName = option?.outPutFileName ?? outPutFileName;
    packageJsonFile = option?.packageJsonFile ?? packageJsonFile;
    showTypeColumn = option?.showTypeColumn ?? showTypeColumn;
    showNpmLinkColumn = option?.showNpmLinkColumn ?? showNpmLinkColumn;
    showDependencies = option?.showDependencies ?? showDependencies;
    showDevDependencies = option?.showDevDependencies ?? showDevDependencies;
    htmlId = option?.htmlId ?? htmlId;
    header = option?.header ?? header;
    isLogOuputEnabled = option?.isLogOuputEnabled ?? isLogOuputEnabled;
    islogOuputMsgEnabled = option?.islogOuputMsgEnabled ?? islogOuputMsgEnabled;
    logMessage = option?.logMessage ?? logMessage;

    const reStr = `<div\\s+id=['"]${htmlId}['"][^\\S\\n]*>[\\S\\s]*?<\\/div>`;
    const regExp = new RegExp(reStr, 'g');
    const { dependencies, devDependencies }: Package = JSON.parse(packageJsonFile);

    if (islogOuputMsgEnabled && option?.outPutFileName && !option?.logMessage) {
        logMessage = `✅ Package list has been updated in the 🚩 ${outPutFileName} file.`;
    }
    if (showTypeColumn) columns = [...columns, 'Type'];
    if (showNpmLinkColumn) columns = [...columns, 'Npm Link'];

    outputString = base + columns.join(base) + ' |\n';

    columns.forEach(() => {
        outputString += base + '----';
    });

    outputString += base + '\n';

    let resultStr: string = outputString;

    if (showDependencies) {
        const dependenciesList: string = generateTable({
            obj: dependencies,
            type: 'dependencies',
            showTypeColumn,
            showNpmLinkColumn
        });
        resultStr = resultStr + dependenciesList;
    }

    if (showDevDependencies) {
        const devDependenciesList: string = generateTable({
            obj: devDependencies,
            type: 'devDependencies',
            showTypeColumn,
            showNpmLinkColumn
        });
        resultStr = resultStr + devDependenciesList;
    }

    const matches: RegExpMatchArray | null = markDownfile.match(regExp);

    if (!matches) throw new Error('No HTML id attribute found in your markdown file. Please read this package documentation');

    const replaceValue: string = markDownfile.replace(
        regExp,
        '<div id=' + `"${htmlId}"` + '>' + '\n\n' + header + '\n\n' + resultStr + '\n' + '</div>'
    );

    const outPutDir = path.dirname(outPutFileName);
    const isoutPutDirExists = fs.existsSync(outPutDir);

    if (!isoutPutDirExists) {
        await fs.mkdir(outPutDir, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }

    await fs.writeFile(outPutFileName, replaceValue, 'utf8', (err) => {
        if (err) throw err;
        if (isLogOuputEnabled) console.log(replaceValue);
        if (islogOuputMsgEnabled) console.log(logMessage);
    });

    return true;
};
