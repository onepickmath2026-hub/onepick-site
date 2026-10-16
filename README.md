# 원픽학원 홈페이지 설치 순서 (처음 한 번만)

이 폴더 전체가 사이트입니다. 아래 순서대로 한 번만 설정하면, 이후에는 `사이트주소/admin` 에서 글과 사진을 직접 올릴 수 있습니다.

## 1. GitHub에 올리기
1. github.com 가입 후 로그인
2. 오른쪽 위 `+` → `New repository` → 이름 입력(예: onepick-site) → `Create repository`
3. 만들어진 화면에서 `uploading an existing file` 클릭
4. 이 폴더 안의 **모든 파일과 폴더**(admin, content, images, index.html, build.js, netlify.toml)를 끌어다 놓고 `Commit changes`

## 2. 넷리파이 연결
1. app.netlify.com 로그인 → `Add new site` → `Import an existing project` → `GitHub`
2. 방금 만든 저장소 선택 → 설정값은 그대로 두고 `Deploy`
3. 배포가 끝나면 나오는 주소(xxxx.netlify.app)가 사이트 주소입니다.

## 3. 글쓰기 도구에 저장소 알려주기
GitHub 저장소에서 `admin/config.yml` 을 열어 연필 아이콘으로 수정합니다.
`repo: 깃허브아이디/저장소이름` 을 실제 값으로 바꾸고 저장합니다. (예: `repo: gildong/onepick-site`)

## 4. GitHub 로그인 연결 (글쓰기 로그인용)
1. GitHub 오른쪽 위 프로필 → `Settings` → 맨 아래 `Developer settings` → `OAuth Apps` → `New OAuth App`
2. Application name: 원픽학원 / Homepage URL: 넷리파이 사이트 주소 / Authorization callback URL: `https://api.netlify.com/auth/done`
3. 만든 뒤 `Client ID` 와 `Generate a new client secret` 으로 Client Secret 생성
4. 넷리파이 사이트 → `Site configuration` → `Access control`(또는 Access & security) → `OAuth` → `Authentication Providers` → `Install provider` → GitHub 선택 → Client ID/Secret 입력

## 5. 글 쓰기
1. `사이트주소/admin` 접속 → `Login with GitHub`
2. `칼럼` → `새 글 쓰기` → 입력 → 상단 `게시`(Publish)
3. `학원 소개 사진` → 사진 추가/삭제 → `게시`
4. 게시 후 1~2분 지나면 사이트에 반영됩니다. (넷리파이가 자동으로 다시 배포합니다.)

## 6. 상담 신청 받기
상담 신청 폼은 넷리파이 Forms로 접수됩니다. 넷리파이 사이트 → `Forms` 에서 신청 내용을 볼 수 있고, `Notifications` 에서 이메일 알림을 설정할 수 있습니다.

## 주의
- 사진에 학생 얼굴이나 이름이 나오지 않게 해주세요.
- 상담 신청 폼에는 이름과 연락처가 들어오므로, 넷리파이 계정 보안(2단계 인증)을 켜 두세요.
