# 🧠 `tiny-brain`

## Overview

tiny-brain is an intelligent context management system for Claude Desktop that fundamentally changes how AI assistants maintain context across conversations. Built as an MCP (Model Context Protocol) server, it provides persistent memory, persona management, and dynamic planning capabilities that survive between chat sessions.

Available for easy installation **[here](https://tiny-brain.com)**.

## Why tiny-brain?

### The Problem

Traditional AI assistants suffer from complete amnesia between conversations. Every new chat starts from zero - no memory of your preferences, no understanding of ongoing projects, no continuity in your work. This forces users to repeatedly provide the same context, explain their preferences, and re-establish working relationships with their AI assistant.

### The Solution

tiny-brain solves this by implementing:

- **Persistent Memory**: A knowledge graph that stores facts, relationships, and context across all conversations
- **Persona System**: Switchable contexts that maintain their own memory, preferences, and active projects
- **Living Documents**: Plans that evolve with your work, tracking progress across multiple sessions
- **Smart Context Loading**: Automatically provides relevant context based on your current persona and work

## Where is the code

the tiny-brain source code will be published as soon as the codebase is less embarrasing. There is still some
AI-generated gloop in there. In addition, the locally installed tiny-brain core will be open source, but the
remote version will not be. The remote version will be the tiny-brain core, but with cloud hosting, i.e. multi-tenant SaaS version. This will cost money to run, so the aim will be a freemium model.

## Technical Architecture

### Core Components

1. **MCP Server**: Built on the Model Context Protocol, integrating seamlessly with Claude Desktop
2. **Local Storage**: All data stored locally on the user's machine for privacy and performance
3. **Knowledge Graph**: Entity-relationship system for intelligent memory management
4. **Persona Engine**: Context isolation and management system

### Data Storage

All tiny-brain data is stored locally in the user's home directory:

**Default location**: `~/.tiny-brain`

**Custom location**: Set `TINY_BRAIN_DATA_PATH` environment variable to use a different path

```
~/.tiny-brain/                 # Storage base (or custom path)
├── debug.log                  # Debug log (when enabled)
└── personas/                  # All personas stored here
    └── [persona-name]/        # One folder per persona
        ├── profile.md         # Persona profile/description
        ├── metadata.json      # Persona metadata  
        ├── insights.json      # Learning insights about the persona
        ├── memory/            # Memory data (managed by memory manager)
        │   └── [memory manager controlled files]
        └── plans/             # Planning data (managed by plan manager)
            └── [plan manager controlled files]
```

#### Storage Architecture

- **Persona Isolation**: Each persona gets its own directory, named exactly as the persona name
- **Standard Files**: Every persona has `profile.md`, `metadata.json`, and `insights.json`
- **Managed Directories**: 
  - `memory/` - Exclusively managed by the memory manager subsystem
  - `plans/` - Exclusively managed by the plan manager subsystem
- **Simple Path Construction**: Uses straightforward path concatenation for reliability

### Key Features

#### Personas
- Each persona maintains isolated context and memory
- Instant switching with the `as` tool
- Automatic profile generation based on usage patterns
- Complete data isolation between personas

#### Memory Management
- Natural language input processed into structured knowledge
- Entity extraction and relationship mapping
- Semantic search across all stored knowledge
- Automatic deduplication and conflict resolution

#### Planning System
- Captures collaborative planning discussions
- Automatically extracts phases and todos
- Tracks progress across conversations
- Generates comprehensive reports

#### Version Management
- Built-in update checking
- Seamless upgrade process
- Backward compatibility for data migrations

### Security & Privacy

- **Local-First**: All data stored on user's machine in readable text files
- **No Cloud Dependencies**: Works entirely offline
- **Transparent Storage**: `JSON` and `markdown` formats for easy inspection
- **User Control**: Simple data management and deletion - no lock in

### Integration

tiny-brain integrates with Claude Desktop through MCP, appearing as native tools:

```javascript
// Example tool usage
/tiny-brain:as({ personaName: "work" })
/tiny-brain:manage_memory({ operation: "remember", content: "..." })
/tiny-brain:plan({ operation: "accept", planName: "...", planDetails: "..." })
```

### Performance Considerations

- Lazy loading of persona data
- Efficient indexing for fast searches
- Minimal overhead on Claude Desktop startup
- Optimized for conversations with 1000s of memories

### Development Philosophy

tiny-brain follows these principles:

1. **Simplicity**: Clean, understandable architecture
2. **Reliability**: Robust error handling and data integrity
3. **Extensibility**: Plugin architecture for future enhancements
4. **User-First**: Features driven by real user needs

### Use Cases

- **Software Development**: Maintain project context, architectural decisions, and implementation details
- **Research**: Build cumulative knowledge across research sessions
- **Content Creation**: Track writing projects, style preferences, and ongoing work
- **Learning**: Progressive knowledge building with persistent notes
- **Team Collaboration**: Shared personas for consistent project understanding

### Future Roadmap

- Multi-model support beyond Claude
- chat message analysis tools to prevent drift and hallucinations
- remote MCP server implementation to allow usage by URL
- persona sharing with other MCP tools

## Getting Started

1. Install the .dxt file in Claude Desktop
2. Create your first persona or use the default
3. Start building persistent context across conversations

## Contributing

tiny-brain is designed to be extensible. Key areas for contribution:

- Memory extraction algorithms
- Persona template system
- Import/export formats
- Tool integrations
- Documentation and examples

## License

[License details will be added when code repository is public]

---

Built with ❤️ for the Claude Desktop community
