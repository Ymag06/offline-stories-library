# Offline Digital Story Library

## 1. Project Overview

### Project Name

Offline Digital Story Library

### Description

An offline-first digital library designed to provide children with free access to educational stories and reading materials, particularly children who have limited access to formal education, libraries, or the internet. Children can also write and save their own stories in the app.

The application allows children to explore, read, and learn from a collection of digital stories without requiring an internet connection, an account, or a paid subscription.

The platform should be simple, accessible, child-friendly, and capable of operating on low-cost devices.

### Main Objective

To make reading and basic educational resources accessible to children regardless of their geographical location, financial circumstances, or internet availability.

### Target Audience

- Children with limited access to formal education.
- Children living in rural and underserved communities.
- Children who do not have access to physical libraries.
- Community learning centres and educational volunteers.

---

## 2. Problem Statement

Many children, particularly those in underserved communities, face barriers to accessing educational resources.

Some of these barriers include:

- Limited access to physical libraries and books.
- Unreliable or unavailable internet connectivity.
- Financial difficulties that prevent families from purchasing books.
- Limited access to formal education.
- Lack of engaging reading materials suitable for children.

Traditional online educational platforms often depend on stable internet connections, making them inaccessible to children who need these resources the most.

### Proposed Solution

Develop a completely offline-capable digital library that provides free reading materials and educational stories.

The application should allow users to:

- Browse available stories.
- Read stories without internet access.
- Write original stories in the app and save them in a local collection.
- Organise stories into categories.
- Continue reading from where they stopped.

---

## 3. Core Requirements

### 3.1 Offline Accessibility

**Priority: Critical**

The application must function without an internet connection.

Requirements:

- The application must launch without internet access.
- All previously installed application resources must remain accessible offline.
- Users must be able to browse the local library offline.
- Stories stored locally must be readable without internet access.
- Reading progress must be saved locally.
- The application must not depend on external APIs or online services for its core functionality.

### 3.2 Digital Story Library

**Priority: Critical**

The application must provide a collection of digital stories.

Requirements:

- Display available stories in a visual library.
- Each story should have a title, cover image, description, and category.
- Stories should be organised into categories.
- Users should be able to search for stories.
- Users should be able to filter stories by category.
- Users should be able to open and read stories.
- The Library should contain built-in stories; user-written stories belong in My Stories.
- Story cards should show whether audio is available for the selected story language. Use a bundled local recording when one is supplied; otherwise use device text-to-speech. Show plain “Audio available/unavailable” labels.
- If audio is unavailable, disable Listen in the story mode choice and explain that reading remains available.

### 3.3 Story Reader

**Priority: Critical**

Provide a simple and comfortable reading experience.

Requirements:

- Display story content clearly.
- Support readable font sizes.
- Provide basic reading controls.
- Allow users to navigate between pages.
- Let readers switch between page-by-page and continuous-scroll layouts.
- Put text-size controls and the layout switch beside the reading area in a collapsible toolbar. In page layout, place previous/next buttons on the book's left and right edges; keep the page count below the book. In scroll layout, keep compact page navigation controls below the reading surface.
- In continuous-scroll mode, show the story in one connected reading surface, not separate page cards. Preserve internal page landmarks for progress tracking.
- Remember the last reading position.
- Allow users to resume reading.
- When a story is opened, let the reader choose Read, Read and listen along, or Listen; recommend Read because offline speech voices depend on the device.
- Listen with a bundled local recording when available, or the browser's locally installed speech voice otherwise. Do not send story text to a service or require a network connection.
- If no installed offline voice matching the story language is available, explain this and offer Read instead.
- Listening controls must support play/pause and backward/forward seeking with a seek bar and short skip buttons. For speech synthesis, clearly label time and position as approximate because it does not provide a consistent audio timeline. For recordings, use the real audio timeline and save the playback position locally.
- In Read and listen along mode, use local browser speech and highlight the current word using word-boundary events. Do not show an inaccurate approximation when boundaries are unavailable. Listen mode uses the bundled recording when present.
- Advance through story pages during listening and save page-level reading progress so the user can resume at the saved page.
- Provide a simple interface suitable for children.

### 3.4 Story Writing and Local Collection

**Priority: High**

Users should be able to create and manage their own stories in the app.

Requirements:

- Provide a guided writing form with prompts for the beginning, middle, and ending.
- Allow the author to set a title, choose English or Burmese for the story, and optionally select a category.
- Store story text and metadata locally in IndexedDB.
- User-written stories must remain available after restarting the application and must work offline.
- Display user-written stories in My Stories.
- Allow users to read, edit, and remove their own stories.
- Treat story text as plain text when displaying it.
- Do not accept arbitrary file uploads in the v1 prototype.

### 3.5 Reading Progress

**Priority: High**

The application should help children keep track of their reading activities.

Requirements:

- Save the last page or reading position.
- Track completed stories.
- Display reading progress.
- Allow children to continue previously opened stories.
- Store progress locally.
- Save the current visible page when reading in continuous-scroll mode.

### 3.6 Child-Friendly Interface

**Priority: Critical**

The interface must be easy for children to understand and navigate.

Requirements:

- Simple navigation.
- Clear labels and icons.
- Large, readable text.
- Attractive story covers.
- Minimal complicated interactions.
- Responsive layout for different screen sizes.
- Avoid unnecessary advertisements and distracting elements.

---

## 4. Technical Requirements

### Frontend

- React
- JavaScript
- Tailwind CSS

### Build Tool

- Vite

### Local Storage

- IndexedDB for storing user-written stories and persistent application data.
- Local storage for small settings where appropriate.

### Offline Support

- Service Worker for caching application resources.
- PWA support for installation and offline launching.

### User-Written Content

- Story text written in the app and saved in IndexedDB.

### Important Technical Constraints

- The application must not require a backend server for core functionality.
- No authentication should be required.
- No internet connection should be necessary for reading locally available stories.
- Application resources must not depend on remotely hosted fonts, scripts, or images.
- The application must work with locally stored content.

---

## 5. User Experience and Navigation

### Main Navigation

The application should provide the following sections:

1. Home
   - Featured stories.
   - Recently opened unfinished built-in stories.
   - Recommended categories.

2. Library
   - Browse all available stories.
   - Search stories.
   - Filter by category.

3. My Stories
   - View user-written stories.
   - Write and edit stories using beginning, middle, and ending prompts.
   - Read or remove user-written stories.

4. Reading Progress
   - View completed stories.
   - Continue reading unfinished stories.

5. Settings
   - Change the display language.
   - Choose a light or dark theme.
   - Manage locally stored content.

Settings should open in a compact side drawer rather than taking over the full page.

---

## 6. Data Management

All essential user data should be stored locally.

### Story Data

Each story should contain:

- ID
- Title
- Description
- Cover image
- Category
- Story pages or sections
- Story language
- Source (built-in or user-written)
- Optional local audio recordings by language and optional page illustrations

### Reading Progress Data

Each reading progress record should contain:

- Story ID
- Last reading position
- Completion status
- Last opened date
- Optional recorded-audio playback position and language

### Data Persistence

- User-written stories must remain available after restarting the application.
- Reading progress must persist between sessions.
- Removing a story should not accidentally remove unrelated reading progress or content.

---

## 7. Distribution and Deployment

The application is intended to reach children across different communities, including areas without reliable internet access.

Possible distribution methods:

- Preloaded Android devices.
- Computers in community learning centres.
- USB drives containing the application and story collection.
- Local community servers for distributing updates and stories.

### Distribution Requirements

- Users should be able to access the application without downloading it from the internet.
- The initial application package should include a collection of stories.
- Additional story collections should be distributable through offline storage.
- Updates should not require continuous internet connectivity.
- The application should support low-cost hardware.

---

## 8. Safety and Privacy

Since the application is designed for children:

- No personal account should be required.
- No unnecessary personal information should be collected.
- No advertisements should be displayed.
- No external tracking should be implemented.
- User-authored text should be rendered as plain text and remain local to the device.
- The application should not expose children to external websites without appropriate safeguards.

---

## 9. MVP (Minimum Viable Product)

The first version should focus on delivering the essential reading experience.

### Must Have

- [ ] Offline application startup.
- [x] Browse built-in stories.
- [x] Story categories.
- [x] Search functionality.
- [x] Write, edit, and remove user-created stories.
- [x] Save user-created stories persistently in local storage.
- [x] Save reading progress.
- [x] Resume reading.
- [x] Offer optional local text-to-speech with pause, approximate seeking, and a reading fallback.
- [ ] Responsive child-friendly interface.

### Future Improvements

- [ ] Add downloadable, offline narration voices if a safe, licensed, device-compatible approach is selected.
- [ ] Multiple languages.
- [ ] Interactive stories.
- [ ] Reading comprehension quizzes.
- [ ] Educational games.
- [ ] Reading recommendations.
- [ ] More story-writing and creative tools.
- [ ] Offline content update system.
- [ ] Learning materials beyond stories.

---

## 10. Success Criteria

The project will be considered successful when:

1. Children can access the library without an internet connection.
2. Users can read the preloaded stories completely offline.
3. Users can write, save, and access their own stories.
4. User-written content remains available after restarting the application.
5. Reading progress is saved correctly.
6. The application is usable on low-cost devices.
7. Children can navigate the application without complicated instructions.
