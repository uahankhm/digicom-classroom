# 디지콤샘 디지털 교실

GitHub Pages에 배포할 수 있는 React + Vite + Tailwind CSS 기반 개인 교육 홈페이지입니다.

디지콤샘의 시니어 대상 스마트폰, AI, 영상 교육 자료와 블로그 글, 수업 영상, 그리고 vibe coding으로 만든 프로그램을 한곳에서 보여주는 교육 플랫폼입니다.

## 기술 구성

- React + Vite
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- GitHub Pages 배포 가능

Python 서버, Flask, Django, Streamlit은 홈페이지 내부에 사용하지 않습니다. 외부 Python 앱이 있다면 프로그램 카드의 `href`에 링크로 연결하는 방식으로 사용합니다.

## 실행 방법

처음 한 번 의존성을 설치합니다.

```powershell
npm install
```

개발 서버를 실행합니다.

```powershell
npm run dev
```

배포용 파일을 빌드합니다.

```powershell
npm run build
```

빌드 결과를 미리 확인합니다.

```powershell
npm run preview
```

## 주요 파일

```text
src/App.jsx
src/index.css
src/firebase-config.js
```

`src/App.jsx` 안의 배열 데이터를 수정하면 프로그램, 강의자료, 회원 영상 카드를 쉽게 추가할 수 있습니다.

```js
const programs = [];
const learningMaterials = [];
const memberVideos = [];
```

버튼과 카드 링크는 현재 `#`으로 되어 있습니다. 나중에 네이버 블로그, 유튜브, 외부 Python 앱, GitHub 저장소 링크로 바꾸면 됩니다.

## Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트를 만듭니다.
2. Project settings에서 Web app을 추가합니다.
3. Firebase SDK 설정값을 `src/firebase-config.js`에 붙여넣습니다.
4. Authentication에서 Email/Password 로그인을 활성화합니다.
5. Firestore Database를 생성합니다.

`src/firebase-config.js` 예시:

```js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## 회원 승인 방식

회원가입을 하면 Firestore에 아래 문서가 생성됩니다.

```text
members/{uid}
```

기본값은 `approved: false`입니다. 관리자는 Firebase Console에서 해당 회원 문서의 `approved` 값을 `true`로 바꾸면 됩니다.

```json
{
  "email": "member@example.com",
  "approved": true,
  "role": "member"
}
```

## Firestore 보안 규칙 예시

배포 전 Firestore Rules에 아래 규칙을 적용하세요.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{userId} {
      allow create: if request.auth != null
        && request.auth.uid == userId
        && request.resource.data.keys().hasOnly(['email', 'approved', 'createdAt', 'role'])
        && request.resource.data.email == request.auth.token.email
        && request.resource.data.approved == false
        && request.resource.data.role == 'member';
      allow read: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if false;
    }
  }
}
```

## GitHub Pages 배포 방법

저장소를 만들고 코드를 올립니다.

```powershell
git init
git add .
git commit -m "Create Hyunmi digital classroom"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/YOUR_REPO.git
git push -u origin main
```

GitHub Actions로 자동 배포하려면 아래 파일을 추가하면 됩니다.

```text
.github/workflows/deploy.yml
```

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

GitHub 저장소 Settings → Pages에서 Source를 GitHub Actions로 선택하면 됩니다.

## 중요한 보안 메모

현재 구현은 승인된 회원에게만 영상 영역을 보여주는 구조입니다. 정말 민감한 영상은 HTML 안에 직접 주소를 넣으면 안 됩니다. 나중에는 Firebase Storage, Cloudflare R2, Vimeo private video, 또는 서버리스 함수로 영상 URL 자체에도 권한 검사를 붙이는 방식이 더 안전합니다.
