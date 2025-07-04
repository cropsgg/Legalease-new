# Chat Interface

A conversational AI interface similar to ChatGPT but specifically designed for business context and agent integration in LegalEase.

## Features

### Chat Layout

#### Header
- **Agent Selection**: Shows current agent with icon, name, and status
- **Status Indicator**: Real-time status (Online, Busy, Offline) with color coding
- **Side Panel Toggle**: Collapsible side panel for additional features
- **Settings**: Quick access to chat settings and preferences

#### Messages Area
- **Responsive Design**: Adapts to different screen sizes
- **Message Types**: Different styling for user, agent, system, action, and confirmation messages
- **Auto-scroll**: Automatically scrolls to latest messages
- **Message Status**: Visual indicators for sending, sent, and error states

#### Input Area
- **Text Input**: Multi-line textarea with placeholder text
- **File Attachments**: Support for PDF, images, documents, and spreadsheets
- **Voice Input**: Microphone button for voice messages
- **Emoji Picker**: Emoji selection interface
- **Send Button**: Primary action button with keyboard shortcut (Enter)

### Message Types

#### Text Messages
- **User Messages**: Right-aligned with brown background and white text
- **Agent Messages**: Left-aligned with white background and border
- **System Messages**: Centered with gray background for notifications

#### Document Messages
- **File Preview**: Thumbnail preview for supported file types
- **File Information**: Name, type, and size display
- **Action Buttons**: View, download, and delete options

#### Agent Actions
- **Processing Indicator**: "Agent is processing..." with spinner animation
- **Progress Bars**: Visual progress for data fetching and document generation
- **Status Updates**: Real-time status messages with percentage completion

#### Confirmations
- **Action Confirmation**: "Confirm filing GST return?" with Yes/No buttons
- **Action Preview**: Detailed information about the action to be performed
- **Cancel Option**: Ability to cancel pending actions

### Input Features

#### @ Mention System
- **Agent Commands**: Use @ to mention specific agents
- **Auto-complete**: Dropdown with available agents
- **Quick Selection**: One-click agent selection

#### File Attachments
- **Drag & Drop**: Intuitive file upload interface
- **Multiple Files**: Support for multiple file selection
- **File Validation**: Type and size restrictions
- **Preview**: File type icons and size information

#### Voice Input
- **Microphone Button**: Voice recording capability
- **Speech Recognition**: Convert speech to text
- **Visual Feedback**: Recording status indicators

#### Emoji Picker
- **Emoji Selection**: Comprehensive emoji library
- **Recent Emojis**: Quick access to frequently used emojis
- **Search**: Find specific emojis quickly

#### Keyboard Shortcuts
- **Enter**: Send message
- **Shift + Enter**: New line
- **Ctrl/Cmd + Enter**: Send message (alternative)
- **Escape**: Clear input or close modals

### Side Panel (Collapsible)

#### Chat History
- **Recent Conversations**: List of previous chat sessions
- **Unread Indicators**: Visual badges for unread messages
- **Quick Access**: One-click navigation to previous chats

#### Agent Memory/Context
- **Context Size**: Current memory usage
- **Retention Period**: How long context is maintained
- **Shared Context**: Status of context sharing between agents

#### Related Documents
- **Document List**: Relevant files and documents
- **File Types**: Icons for different file types (PDF, images, spreadsheets)
- **Quick Actions**: View, download, and share options

#### Quick Actions
- **Common Tasks**: Pre-defined action buttons
- **Agent-specific**: Actions relevant to current agent
- **One-click Execution**: Instant task execution

## Technical Implementation

### Components Used
- **Sheet**: Collapsible side panel
- **ScrollArea**: Scrollable message container
- **Avatar**: User and agent profile pictures
- **Badge**: Status indicators and labels
- **Progress**: Progress bars for actions
- **Button**: Action buttons with consistent styling
- **Textarea**: Multi-line text input
- **Card**: Information containers

### State Management
- **messages**: Array of chat messages
- **inputValue**: Current input text
- **selectedAgent**: Currently active agent
- **isSidePanelOpen**: Side panel visibility
- **isProcessing**: Agent processing status
- **attachments**: File attachments array

### Message Structure
```typescript
interface Message {
  id: string;
  type: 'user' | 'agent' | 'system' | 'action' | 'confirmation';
  content: string;
  timestamp: Date;
  sender?: string;
  avatar?: string;
  status?: 'sending' | 'sent' | 'error';
  attachments?: Attachment[];
  actions?: Action[];
  progress?: number;
  actionType?: 'processing' | 'fetching' | 'generating';
  confirmation?: ConfirmationData;
}
```

### Styling
- **LegalEase Theme**: Consistent with app-wide design
- **Color Palette**:
  - Primary: `#8B4513` (Brown)
  - Background: `#F8F3EE` (Light beige)
  - Text: `#2A2A2A` (Dark gray)
  - Secondary: `#8B7355` (Muted brown)
  - Borders: `#D1C4B8` (Soft brown)
- **Message Bubbles**: Rounded corners with appropriate alignment
- **Status Colors**: Green (online), Yellow (busy), Red (offline)

### Icons
- **Lucide React**: Consistent icon library
- **Status Icons**: CheckCircle, Clock, AlertCircle
- **Action Icons**: Send, Paperclip, Mic, Smile
- **File Icons**: FilePdf, FileImage, FileSpreadsheet, FileText
- **Feature Icons**: Brain, History, Zap, Settings

## Usage

### Starting a Conversation
1. Navigate to `/chat` in the application
2. Select an agent from the header
3. Type your message in the input area
4. Press Enter or click Send

### Using @ Mentions
1. Type `@` in the input area
2. Select an agent from the dropdown
3. Continue typing your message
4. The agent will be notified and respond accordingly

### Attaching Files
1. Click the paperclip icon
2. Select files from your device
3. Review the attachment preview
4. Send the message with attachments

### Using Voice Input
1. Click the microphone icon
2. Speak your message
3. Review the transcribed text
4. Send or edit as needed

### Accessing Side Panel
1. Click "Side Panel" in the header
2. Browse chat history, agent memory, and quick actions
3. Use quick action buttons for common tasks
4. View related documents and context

## Integration

### Navigation
- Added to sidebar navigation as "Chat"
- Accessible via `/chat` route
- Integrated with existing app navigation

### Authentication
- Respects user authentication state
- Shows user avatar and initials
- Integrates with existing auth context

### Agent Integration
- Connects with AI agents from the agents page
- Real-time status updates
- Context sharing between agents
- Memory and history persistence

### Theming
- Uses LegalEase color scheme consistently
- Matches existing component styling
- Responsive design patterns
- Professional legal aesthetic

## Future Enhancements

### Planned Features
- **Real-time Typing**: Show when agent is typing
- **Message Reactions**: Emoji reactions to messages
- **Message Threading**: Reply to specific messages
- **Advanced Search**: Search through chat history
- **Export Chat**: Download conversation history
- **Voice Messages**: Audio message support
- **Screen Sharing**: Visual collaboration features

### Performance Optimizations
- **Message Pagination**: Load messages on demand
- **Image Optimization**: Compress and optimize images
- **Caching**: Cache frequently accessed data
- **WebSocket**: Real-time message updates
- **Offline Support**: Basic functionality without internet

## File Structure

```
frontend/app/chat/
├── page.tsx          # Main chat interface
└── README.md         # This documentation
```

## Dependencies

- **React**: Core framework
- **Next.js**: Routing and SSR
- **Lucide React**: Icon library
- **Framer Motion**: Animation library (if needed)
- **Tailwind CSS**: Styling framework
- **shadcn/ui**: Component library
