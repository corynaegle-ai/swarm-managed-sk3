# PlayerSetup Component Documentation

## Overview

The `PlayerSetup` component provides a comprehensive interface for configuring and managing player settings within the player management system. It offers a streamlined setup experience with customizable options and built-in accessibility features.

## Component API

### Props Interface

```typescript
interface PlayerSetupProps {
  /** Player data object containing initial configuration */
  player?: Player;
  
  /** Callback function triggered when setup is completed */
  onSetupComplete: (playerData: Player) => void;
  
  /** Callback function triggered when setup is cancelled */
  onCancel?: () => void;
  
  /** Array of available player roles/positions */
  availableRoles?: string[];
  
  /** Custom validation rules for player data */
  validationRules?: ValidationRule[];
  
  /** Whether the component is in edit mode (default: false) */
  isEditMode?: boolean;
  
  /** Loading state indicator */
  isLoading?: boolean;
  
  /** Custom CSS class name for styling */
  className?: string;
  
  /** Whether to show advanced configuration options */
  showAdvancedOptions?: boolean;
  
  /** Theme variant for the component */
  variant?: 'default' | 'compact' | 'detailed';
  
  /** Accessibility label for screen readers */
  ariaLabel?: string;
}
```

### Player Data Structure

```typescript
interface Player {
  id?: string;
  name: string;
  email?: string;
  role: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredPosition?: string;
  avatar?: string;
  isActive: boolean;
  settings: {
    notifications: boolean;
    publicProfile: boolean;
    allowMessages: boolean;
  };
  metadata?: {
    joinedDate: Date;
    lastActive: Date;
    tags: string[];
  };
}
```

## Usage Examples

### Basic Setup

```jsx
import React from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';

function BasicPlayerSetup() {
  const handleSetupComplete = (playerData) => {
    console.log('Player setup completed:', playerData);
    // Process the player data
  };

  return (
    <PlayerSetup
      onSetupComplete={handleSetupComplete}
      availableRoles={['goalkeeper', 'defender', 'midfielder', 'forward']}
    />
  );
}
```

### Edit Mode with Existing Player

```jsx
import React from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';

function EditPlayerSetup({ existingPlayer }) {
  const handleUpdate = (updatedPlayerData) => {
    // Update player in database
    updatePlayer(updatedPlayerData);
  };

  const handleCancel = () => {
    // Navigate back or close modal
    router.back();
  };

  return (
    <PlayerSetup
      player={existingPlayer}
      isEditMode={true}
      onSetupComplete={handleUpdate}
      onCancel={handleCancel}
      showAdvancedOptions={true}
    />
  );
}
```

### Advanced Configuration with Custom Validation

```jsx
import React from 'react';
import { PlayerSetup } from '@/components/PlayerSetup';

function AdvancedPlayerSetup() {
  const customValidationRules = [
    {
      field: 'name',
      rule: 'minLength',
      value: 2,
      message: 'Name must be at least 2 characters long'
    },
    {
      field: 'email',
      rule: 'email',
      message: 'Please enter a valid email address'
    }
  ];

  return (
    <PlayerSetup
      validationRules={customValidationRules}
      variant="detailed"
      showAdvancedOptions={true}
      onSetupComplete={(data) => console.log('Setup complete:', data)}
      className="custom-player-setup"
      ariaLabel="Player configuration form"
    />
  );
}
```

## Integration Instructions

### 1. Installation and Import

```bash
npm install @your-org/player-management
```

```jsx
import { PlayerSetup } from '@your-org/player-management';
```

### 2. State Management Integration

#### With Redux

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { createPlayer, updatePlayer } from '@/store/playerSlice';

function PlayerSetupContainer() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.players.loading);
  
  const handleSetupComplete = (playerData) => {
    if (playerData.id) {
      dispatch(updatePlayer(playerData));
    } else {
      dispatch(createPlayer(playerData));
    }
  };

  return (
    <PlayerSetup
      isLoading={isLoading}
      onSetupComplete={handleSetupComplete}
    />
  );
}
```

#### With Context API

```jsx
import { useContext } from 'react';
import { PlayerContext } from '@/context/PlayerContext';

function PlayerSetupWithContext() {
  const { addPlayer, isLoading } = useContext(PlayerContext);
  
  return (
    <PlayerSetup
      isLoading={isLoading}
      onSetupComplete={addPlayer}
    />
  );
}
```

### 3. Routing Integration

```jsx
// Using Next.js Router
import { useRouter } from 'next/router';

function PlayerSetupPage() {
  const router = useRouter();
  
  const handleComplete = (playerData) => {
    // Save player data
    savePlayer(playerData);
    // Redirect to player dashboard
    router.push('/dashboard');
  };

  return (
    <PlayerSetup
      onSetupComplete={handleComplete}
      onCancel={() => router.back()}
    />
  );
}
```

## Styling Guide

### CSS Variables

The component uses CSS custom properties for theming:

```css
:root {
  --player-setup-primary-color: #2563eb;
  --player-setup-secondary-color: #64748b;
  --player-setup-background: #ffffff;
  --player-setup-border-radius: 8px;
  --player-setup-spacing-unit: 16px;
  --player-setup-font-family: 'Inter', sans-serif;
  --player-setup-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Theme Variants

#### Default Variant
```css
.player-setup--default {
  max-width: 500px;
  padding: var(--player-setup-spacing-unit);
  border-radius: var(--player-setup-border-radius);
  box-shadow: var(--player-setup-shadow);
}
```

#### Compact Variant
```css
.player-setup--compact {
  max-width: 400px;
  padding: calc(var(--player-setup-spacing-unit) * 0.75);
}

.player-setup--compact .form-field {
  margin-bottom: calc(var(--player-setup-spacing-unit) * 0.5);
}
```

#### Detailed Variant
```css
.player-setup--detailed {
  max-width: 700px;
  padding: calc(var(--player-setup-spacing-unit) * 1.5);
}

.player-setup--detailed .advanced-options {
  display: block;
}
```

### Custom Styling Examples

```css
/* Custom brand colors */
.custom-player-setup {
  --player-setup-primary-color: #10b981;
  --player-setup-secondary-color: #6b7280;
}

/* Dark theme support */
.player-setup--dark {
  --player-setup-background: #1f2937;
  --player-setup-text-color: #f9fafb;
  --player-setup-border-color: #374151;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .player-setup {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
  }
}
```

### SCSS Mixin for Custom Themes

```scss
@mixin player-setup-theme($primary, $secondary, $background: #fff) {
  --player-setup-primary-color: #{$primary};
  --player-setup-secondary-color: #{$secondary};
  --player-setup-background: #{$background};
}

.team-alpha-theme {
  @include player-setup-theme(#3b82f6, #6b7280);
}
```

## Accessibility Features

### Built-in Accessibility

- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators and focus trapping in modals
- **High Contrast**: Support for high contrast mode and custom color schemes
- **Form Validation**: Accessible error messages with proper ARIA associations

### ARIA Attributes

```jsx
<PlayerSetup
  ariaLabel="Player registration form"
  // Additional accessibility props are handled internally
/>
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between form fields |
| `Shift + Tab` | Navigate backwards |
| `Enter` | Submit form or activate buttons |
| `Escape` | Cancel setup (if onCancel provided) |
| `Space` | Toggle checkboxes and buttons |

## Error Handling

### Validation Errors

The component provides built-in validation with customizable error messages:

```jsx
const validationConfig = {
  name: {
    required: true,
    minLength: 2,
    message: 'Please enter a valid name (minimum 2 characters)'
  },
  email: {
    required: false,
    format: 'email',
    message: 'Please enter a valid email address'
  },
  role: {
    required: true,
    message: 'Please select a player role'
  }
};
```

### Error States

```jsx
// Handle submission errors
const handleSetupComplete = async (playerData) => {
  try {
    await savePlayer(playerData);
  } catch (error) {
    // Component will display error state
    setError(error.message);
  }
};
```

## Testing

### Unit Test Example

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlayerSetup } from '@/components/PlayerSetup';

describe('PlayerSetup Component', () => {
  it('should call onSetupComplete with valid data', async () => {
    const mockOnComplete = jest.fn();
    
    render(
      <PlayerSetup
        onSetupComplete={mockOnComplete}
        availableRoles={['goalkeeper', 'defender']}
      />
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'goalkeeper' }
    });

    // Submit
    fireEvent.click(screen.getByText(/complete setup/i));

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          role: 'goalkeeper'
        })
      );
    });
  });
});
```

## Screenshots

<!-- Screenshot placeholders for documentation -->

### Basic Setup View
*[Screenshot: Basic player setup form with name, role, and skill level fields]*

### Advanced Configuration
*[Screenshot: Expanded form with additional settings and preferences]*

### Mobile View
*[Screenshot: Responsive design on mobile device]*

### Error State
*[Screenshot: Form with validation errors displayed]*

### Success State
*[Screenshot: Completed setup with success message]*

## Performance Considerations

- Component uses React.memo for optimization
- Form validation is debounced to prevent excessive re-renders
- Large role lists are virtualized for better performance
- Images are lazy-loaded with proper fallbacks

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration Guide

### From v1.x to v2.x

```jsx
// v1.x
<PlayerSetup
  playerData={player}
  onComplete={handleComplete}
  roles={availableRoles}
/>

// v2.x
<PlayerSetup
  player={player}
  onSetupComplete={handleComplete}
  availableRoles={availableRoles}
/>
```

## Contributing

When contributing to the PlayerSetup component:

1. Ensure all accessibility features are maintained
2. Add appropriate tests for new features
3. Update documentation for any API changes
4. Follow the existing code style and patterns

## Support

For issues or questions regarding the PlayerSetup component:

- GitHub Issues: [component-issues](https://github.com/your-org/components/issues)
- Documentation: [component-docs](https://docs.your-org.com/components)
- Slack: #player-management-support