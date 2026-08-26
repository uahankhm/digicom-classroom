# AI 논문 블로그 등록 규격

홈페이지는 논문 블로그를 직접 작성하지 않고, 이미 생성된 논문 블로그를 조회만 합니다.
논문 블로그 생성 프로그램은 글 생성이 끝난 뒤 Firebase에 아래 자료를 등록해야 합니다.

## 역할 분리

- 논문 블로그 생성 프로그램: 노션 글 작성, 조회용 HTML 생성, 이미지 업로드, Firestore 등록
- Firebase Storage: 조회용 HTML과 이미지 파일 저장
- Firestore: 홈페이지 목록 조회용 메타데이터 저장
- 홈페이지: Firestore 목록을 읽고 선택된 `contentUrl`을 오른쪽 조회 영역에 표시

## Storage 업로드 구조

권장 경로:

```text
paper-blogs/{paperBlogId}/index.html
paper-blogs/{paperBlogId}/images/01.png
paper-blogs/{paperBlogId}/images/02.png
```

`index.html` 안의 이미지는 Firebase Storage에서 발급받은 다운로드 URL을 사용합니다.
노션 임시 이미지 주소나 로컬 PC 경로를 그대로 넣지 않습니다.

```html
<img src="https://firebasestorage.googleapis.com/..." alt="논문 설명 이미지">
```

업로드할 때 파일 메타데이터도 지정합니다.

```js
// index.html
{ contentType: "text/html; charset=utf-8" }

// 이미지
{ contentType: "image/png" } // jpg이면 image/jpeg
```

## Firestore 컬렉션

컬렉션 이름:

```text
paperBlogs
```

문서 ID:

```text
paper-blog-YYYYMMDD-001
```

문서 필드:

```js
{
  title: "블로그 제목",
  createdAt: serverTimestamp(),
  contentUrl: "Firebase Storage에 업로드된 index.html 다운로드 URL",
  visible: true
}
```

## 필드 의미

- `title`: 홈페이지 왼쪽 목록과 검색에 표시할 블로그 제목
- `createdAt`: 최신순 정렬 기준
- `contentUrl`: 오른쪽 조회 화면에 표시할 HTML 주소
- `visible`: `false`이면 홈페이지 목록에서 숨김

## 등록 흐름

1. 노션에 논문 블로그를 작성합니다.
2. 같은 내용을 조회용 `index.html`로 생성합니다.
3. 글에 포함된 이미지를 Firebase Storage에 업로드합니다.
4. `index.html` 안의 이미지 경로를 Storage 다운로드 URL로 바꿉니다.
5. `index.html`을 Firebase Storage에 업로드합니다.
6. Firestore `paperBlogs` 컬렉션에 제목, 등록일, `contentUrl`, 공개 여부를 등록합니다.

## 홈페이지에서 기대하는 동작

- 홈페이지는 `paperBlogs` 컬렉션을 `createdAt` 최신순으로 읽습니다.
- `visible !== false`인 글만 목록에 표시합니다.
- 왼쪽에서는 `title` 기준으로 검색합니다.
- 사용자가 제목을 선택하면 오른쪽 iframe에 `contentUrl`을 표시합니다.
