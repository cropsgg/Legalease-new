# AI Agents Interface

A comprehensive agent management interface for LegalEase that allows users to view, configure, and test AI agents for legal automation tasks.

## Features

### Agent Grid Layout (2x3)
- **Responsive Design**: Adapts from 1 column on mobile to 3 columns on desktop
- **Agent Cards**: Each card displays agent information and status
- **Status Indicators**: Visual status badges (Available, Busy, Offline)
- **Quick Actions**: Run, Configure, and Test buttons for each agent

### Available Agents

#### 1. Tax Filing Copilot
- **Icon**: Calculator with AI sparkles
- **Status**: Available
- **Description**: "Automates ITR and GST filing"
- **Capabilities**:
  - ITR filing automation
  - GST return preparation
  - Tax calculation
  - Document verification
  - Deadline tracking

#### 2. Compliance Health Agent
- **Icon**: Shield with checkmark
- **Status**: Available
- **Description**: "Monitors compliance deadlines"
- **Capabilities**:
  - Deadline monitoring
  - Compliance alerts
  - Risk assessment
  - Regulatory updates
  - Audit preparation

#### 3. Notice Responder
- **Icon**: Mail with reply arrow
- **Status**: Available
- **Description**: "Drafts responses to tax notices"
- **Capabilities**:
  - Notice analysis
  - Response drafting
  - Legal compliance
  - Document generation
  - Follow-up tracking

#### 4. Document Generator
- **Icon**: Document with magic wand
- **Status**: Available
- **Description**: "Creates legal documents"
- **Capabilities**:
  - Contract generation
  - Agreement drafting
  - Legal templates
  - Document review
  - Version control

#### 5. Trademark Assistant
- **Icon**: TM symbol
- **Status**: Available
- **Description**: "Handles trademark applications"
- **Capabilities**:
  - Trademark search
  - Application filing
  - Status tracking
  - Opposition handling
  - Renewal reminders

#### 6. General Assistant
- **Icon**: Chat bubble
- **Status**: Available
- **Description**: "General Q&A and guidance"
- **Capabilities**:
  - Legal Q&A
  - Guidance provision
  - Research assistance
  - Best practices
  - Resource recommendations

### Agent Detail Modal

#### Configuration Options
- **Auto Process**: Automatically process requests
- **Notifications**: Send status notifications
- **Backup Mode**: Enable backup processing
- **Priority Level**: Set processing priority (Low, Medium, High)

#### Memory & Context Settings
- **Context Size**: Memory allocation for agent
- **Retention Days**: How long to retain context
- **Shared Context**: Enable context sharing between agents

#### Usage Statistics
- **Total Uses**: Number of times agent has been used
- **Success Rate**: Percentage of successful operations
- **Average Response Time**: Typical response time

### Test Interface

#### Features
- **Test Query Input**: Text area for entering test queries
- **Sample Queries**: Quick test buttons for common scenarios
- **Response Area**: Display area for agent responses
- **Run Test Button**: Execute test queries

#### Sample Queries
- Pre-populated test queries based on agent capabilities
- One-click testing for common use cases
- Custom query input for specific testing needs

## Technical Implementation

### Components Used
- **Card**: Agent display cards with hover effects
- **Badge**: Status indicators and capability tags
- **Dialog**: Configuration and test modals
- **Switch**: Toggle controls for settings
- **Select**: Dropdown for priority selection
- **Button**: Action buttons with consistent styling

### State Management
- **selectedAgent**: Currently selected agent for modals
- **isConfigModalOpen**: Configuration modal visibility
- **isTestModalOpen**: Test modal visibility
- **testQuery**: Current test query text

### Styling
- **LegalEase Theme**: Consistent with app-wide design
- **Color Palette**:
  - Primary: `#8B4513` (Brown)
  - Background: `#F8F3EE` (Light beige)
  - Text: `#2A2A2A` (Dark gray)
  - Secondary: `#8B7355` (Muted brown)
- **Responsive Design**: Mobile-first approach with breakpoints

### Icons
- **Lucide React**: Consistent icon library
- **Status Icons**: CheckCircle, Clock, AlertCircle
- **Action Icons**: Play, Settings, TestTube
- **Feature Icons**: Calculator, Shield, Mail, FileText, Star, MessageCircle

## Usage

### Viewing Agents
1. Navigate to `/agents` in the application
2. View the agent grid showing all available agents
3. Check status indicators and usage statistics

### Configuring an Agent
1. Click the "Configure" button (Settings icon) on any agent card
2. Modify settings in the configuration modal
3. Toggle switches for auto-process, notifications, and backup mode
4. Set priority level using the dropdown
5. Click "Save Configuration" to apply changes

### Testing an Agent
1. Click the "Test" button (TestTube icon) on any agent card
2. Enter a test query or use sample queries
3. Click "Run Test" to execute the query
4. View the response in the response area

### Running an Agent
1. Click the "Run" button on any agent card
2. Agent will be activated for immediate use
3. Status will update to "Busy" during execution

## Integration

### Navigation
- Added to sidebar navigation as "Agents"
- Accessible via `/agents` route
- Integrated with existing app navigation

### Authentication
- Respects user authentication state
- Shows premium badge for guest users
- Integrates with existing auth context

### Theming
- Uses LegalEase color scheme consistently
- Matches existing component styling
- Responsive design patterns

## Future Enhancements

### Planned Features
- **Agent Analytics**: Detailed usage analytics and performance metrics
- **Custom Agents**: User-defined agent creation
- **Agent Marketplace**: Third-party agent integration
- **Batch Operations**: Bulk agent configuration
- **Advanced Testing**: Automated test suites for agents

### Performance Optimizations
- **Lazy Loading**: Load agent data on demand
- **Caching**: Cache agent configurations and responses
- **Real-time Updates**: Live status updates via WebSocket
- **Offline Support**: Basic functionality without internet

## File Structure

```
frontend/app/agents/
├── page.tsx          # Main agents interface
└── README.md         # This documentation
```

## Dependencies

- **React**: Core framework
- **Next.js**: Routing and SSR
- **Lucide React**: Icon library
- **Framer Motion**: Animation library (if needed)
- **Tailwind CSS**: Styling framework
- **shadcn/ui**: Component library
