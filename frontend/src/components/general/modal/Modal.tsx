import './Modal.scss'; // Add some styling to make it look like a modal

interface ModalProps {
    isOpen: boolean;
    onClose: (e: React.MouseEvent) => void;
    children: React.ReactNode;  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.  // Replace with your own component type if needed. For example, a form component.
}

// Modal component
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null; // Do not render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;