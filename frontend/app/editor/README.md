# LegalEase AI Markdown Editor

A Cursor-inspired markdown editor with AI-powered legal document generation capabilities.

## Features

### Editor Layout
- **Split-pane design**: 60% editor, 40% live preview
- **Line numbers**: Professional code editor feel
- **Syntax highlighting**: Markdown syntax support
- **Real-time preview**: Live rendering of markdown content

### AI Integration
- **@ Command Palette**: Triggered by typing `@` or `Ctrl+Shift+P`
- **Agent Commands**:
  - `@Generate Employment Contract`
  - `@File GST Return`
  - `@Draft Legal Notice`
  - `@Check Compliance Status`
- **Agent Selection**: Choose from different AI specialists
- **Processing Status**: Real-time feedback on AI operations

### Formatting Tools
- **Toolbar buttons**: Bold, Italic, Lists, Tables
- **Keyboard shortcuts**: Quick formatting options
- **Markdown support**: Full markdown syntax
- **Live rendering**: Instant preview updates

### Document Management
- **File operations**: New, Save, Export
- **Auto-save**: Automatic document saving
- **Word count**: Real-time word counting
- **Status bar**: Document status and blockchain hash

### Legal Theme Integration
- **Professional colors**: Legal brown and cream palette
- **Typography**: Baskervville and Montserrat fonts
- **Consistent styling**: Matches LegalEase brand
- **Responsive design**: Works on all screen sizes

## Usage

1. **Access the Editor**: Navigate to `/editor` or use the sidebar navigation
2. **Start Writing**: Type your legal document in markdown format
3. **Use AI Commands**: Type `@` to see available AI commands
4. **Format Content**: Use toolbar buttons or markdown syntax
5. **Preview**: See live preview in the right pane
6. **Save**: Use the save button or auto-save feature

## Keyboard Shortcuts

- `Ctrl+Shift+P`: Open command palette
- `Escape`: Close command palette
- `Ctrl+S`: Save document (browser default)

## AI Commands

Each command includes:
- **Description**: What the command does
- **Parameters**: Required information
- **Processing**: Real-time status updates
- **Output**: Generated content and blockchain hash

## Technical Details

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom legal theme
- **Icons**: Lucide React icons
- **State Management**: React hooks
- **Markdown Parsing**: Custom regex-based parser

## Future Enhancements

- Monaco Editor integration for advanced features
- CodeMirror for better syntax highlighting
- File upload and attachment support
- Collaborative editing
- Version history and diff view
- Advanced AI model integration
- PDF export functionality
