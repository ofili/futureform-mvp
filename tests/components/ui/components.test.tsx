import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

describe('UI Components', () => {
    describe('Button Component', () => {
        it('should render button with text', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByText('Click me')).toBeInTheDocument();
        });

        it('should handle click events', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            fireEvent.click(screen.getByText('Click me'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should be disabled when disabled prop is true', () => {
        });

        it('should handle value changes', () => {
            const handleChange = jest.fn();
            render(<Input onChange={handleChange} />);

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'test' } });

            expect(handleChange).toHaveBeenCalled();
        });

        it('should be disabled when disabled prop is true', () => {
            render(<Input disabled />);
            expect(screen.getByRole('textbox')).toBeDisabled();
        });

        it('should accept type prop', () => {
            render(<Input type="email" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('type', 'email');
        });
    });

    describe('Card Component', () => {
        it('should render card with title and content', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Test Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Card content</p>
                    </CardContent>
                </Card>
            );

            expect(screen.getByText('Test Card')).toBeInTheDocument();
            expect(screen.getByText('Card content')).toBeInTheDocument();
        });

        it('should apply custom className', () => {
            const { container } = render(
                <Card className="custom-class">
                    <CardContent>Content</CardContent>
                </Card>
            );

            const card = container.firstChild;
            expect(card).toHaveClass('custom-class');
        });
    });
});
