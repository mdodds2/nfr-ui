import { Form, Link, useActionData } from 'react-router-dom';

export default function CredentialsForm( {mode = 'signup'} ) {

  const actionData = useActionData();
  
  return (
    //<!-- LOGIN PAGE -->
      <div className="login-container" id="loginPage">
        <div className="login-card">
          <div className="login-header">
            <h1>NFR Report Builder</h1>
            <p>Sign in to start creating</p>
          </div>

          <div className="login-body">

            <Form method="POST" className="login-form">

              { mode === 'signup' && <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  placeholder="User first and last names" 
                  required 
                />
              </div>}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="name@company.com" 
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">{mode === 'forgot' && "Current "}Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  placeholder="••••••••" 
                  required 
                />
              </div>

              { mode === 'forgot' && <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword"
                  placeholder="••••••••" 
                  required 
                />
              </div> }

              { (mode === 'signup' || mode === 'forgot') && <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  placeholder="••••••••" 
                  required 
                />
              </div>}

              { mode === 'login' && <div className="forgot">
                <Link to="/Forgot">Forgot password?</Link>
              </div>}
            

             {actionData && actionData.message && <p className="error">{actionData.message}</p>}

              <button className="btn">
                {mode === 'login' && "Sign In"}
                {mode === 'signup' && "Sign Up"}
                {mode === 'forgot' && "Change Password"}
              </button>
            </Form>

            {mode === 'login' && <div className="signup">
                <Link to="/signup">Create Account</Link>
            </div>}

            {mode !== 'login' && <div className="signup">
                <Link to="/">Cancel</Link>
            </div>}

          </div>
        </div>
      </div>
  );
}


