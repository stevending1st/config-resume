<p align="center">
  <image alt="config-resume logo" src="./assets/logo.png" width="360"/>
</p>

> ⚠️ **Warning:** The project is still in a very early stage and may undergo breaking changes at any time.

<h1 align="center">config-resume</h1>

<p align="center">

![GitHub License](https://img.shields.io/github/license/stevending1st/config-resume?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/stevending1st/config-resume?style=flat-square) ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/stevending1st/config-resume/main?style=flat-square) ![GitHub Repo stars](https://img.shields.io/github/stars/stevending1st/config-resume?style=flat-square)

</p>

> A resume page rendering tool with modern architecture.

## Why

When I first used [resume-cli](https://github.com/jsonresume/resume-cli), I was fascinated by its approach, which allowed me to generate my desired online resume by simply managing a single configuration file. However, I found it challenging to create a multilingual resume using this tool. Eventually, as I was preparing to switch jobs and needed such a tool urgently, I embarked on this project. This is the story behind the tool that you see here.

## Usage

### Create a New Project

#### Installation

```bash
npm i -g @config-resume/cli
```

#### Initialize the project

Create a new folder, open the command line in that folder, and execute a command:

```bash
cr
```

Follow the prompts to complete the setup, and wait for the project to initialize. During this process, the project will install the default theme globally. When the project prompts `Local http://localhost:4321/`, you can visit this webpage to preview the resume.

You can modify the content of the `resume.en.json` file, and these changes will be updated on the webpage in real-time.

The schema for the resume information file (`resume.**.json`) is consistent with https://jsonresume.org/schema/. You can use this schema as a guide to modify your resume information file.

#### Internationalization

Good internationalization support is the original intention behind creating this project. You can create a file named `resume.[lang].json`, where `[lang]` can be `en-us`, `en`, `zh-cn`, or `zh`. The default theme has good support for these languages, and similarly, the schema needs to be consistent with https://jsonresume.org/schema/.

You can access the resume in the corresponding language by adding `?lang=[lang]` to the URL, for example, use `?lang=zh` to access the Chinese version of the resume page.

Of course, you can also customize support for a new language, such as `zh-tw`, by following these steps:

1. As mentioned above, create a file named `resume.zh-tw.json`.

2. Create a folder named `i18n` in the root directory of the project.

3. Create a file named `zh-tw.json` inside the `i18n` folder, and paste the following code into the file:

```json
{
  "awards": "奖项",
  "basics": "基本資訊",
  "certificates": "證書",
  "education": "教育",
  "interests": "興趣",
  "languages": "語言",
  "projects": "專案",
  "publications": "出版",
  "references": "推薦",
  "skills": "技能",
  "summary": "簡介",
  "volunteer": "志願",
  "work": "工作"
}
```

4. You can access the `zh-tw` language version by adding `?lang=zh-tw` to the URL.

### Build

You can run the following command to package the project:

```bash
cr build
```

### preview

The project offers a preview feature, which you can access by running the following command:

```bash
cr preview
```

**Note:** You need to add `/[lang]` to the URL route to view the page in the corresponding language.

### Base Path

The project supports a base path for deployment to services like GitHub Pages. When executing the command, you need to add the parameter: `--base <BASE_PATH>` or `-b <BASE_PATH>`.

For more information about `base`, please refer to: https://docs.astro.build/en/reference/configuration-reference/#base .

## Roadmap

- ✅ Support for configuration files;
- ✅Theme switching language support;
- YAML file support;
- ✅ Support for custom themes;
- Support for global installation of theme packages via pnpm;
- ...

## License

MIT
