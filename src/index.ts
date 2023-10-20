import fs from 'fs';
import path from 'path';

export interface DependencyType {
    [key: string]: string;
}

export interface Package {
    dependencies: DependencyType;
    devDependencies: DependencyType;
}

export interface Option {
    outPutFileName: string;
    packageJsonFile: string;
    showNpmLinkColumn: boolean;
    showTypeColumn: boolean;
    showDependencies: boolean;
    showDevDependencies: boolean;
}

const appDir: string = path.resolve('./');
const packageJsonFilePath: string = path.join(appDir, 'package.json');
let packageJsonFile = fs.readFileSync(packageJsonFilePath, 'utf-8');

const regExp: RegExp = /<div\s+id="content">[\S\s]*?<\/div>/gi;
const npmBaseLink: string = 'https://www.npmjs.com/package/';
const base: string = ' | ';
let outputString: string = '';
let outPutFileName: string = 'README.md';
let showNpmLinkColumn: boolean = true;
let showTypeColumn: boolean = true;
let showDependencies: boolean = true;
let showDevDependencies: boolean = true;
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

export const generateTableMarkDown = (markDownfile: string, option?: Option) => {
    outPutFileName = option?.outPutFileName ?? outPutFileName;
    packageJsonFile = option?.packageJsonFile ?? packageJsonFile;
    showTypeColumn = option?.showTypeColumn ?? showTypeColumn;
    showNpmLinkColumn = option?.showNpmLinkColumn ?? showNpmLinkColumn;
    showDependencies = option?.showDependencies ?? showDependencies;
    showDevDependencies = option?.showDevDependencies ?? showDevDependencies;

    const { dependencies, devDependencies }: Package = JSON.parse(packageJsonFile);

    if (showTypeColumn) columns = [...columns, 'Type'];
    if (showNpmLinkColumn) columns = [...columns, 'Npm Link'];

    outputString = base + columns.join(base) + ' |\n';

    columns.forEach((e) => {
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

    if (matches) {
        const subStr: string = matches.join(' ');

        if (subStr) {
            const res: string = markDownfile.replace(
                subStr,
                '<div id="content">' + '\n\n' + '## Package List' + '\n\n' + resultStr + '\n' + '</div>'
            );

            console.log(res);
            console.log('Package list has been updated in the readme file');

            fs.writeFile(outPutFileName, res, 'utf8', (err) => {
                if (err) return console.log(err);
            });
        }
    }
};
