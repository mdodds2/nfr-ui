export default function Modal({ isOpen, onClose, children }) {

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
                maxHeight: "80vh",
                overflowY: "auto",
            }}
        >
            <div
                style={{
                    background: "white", padding: "20px", borderRadius: "10px"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}


  
