# Deployment & Debugging Log

During the Readiness Sprint deployment to Render, our team overcame several critical infrastructure blockers:

*   **Database Migration Race Conditions:** Running `flask db upgrade` in the build step failed without a fully initialized app context. **Resolution:** We adjusted the execution order to run migrations right before the Gunicorn startup command.
*   **Python 3.12+ Dependency Deprecation:** Gunicorn crashed on startup with `ModuleNotFoundError: No module named 'pkg_resources'`. **Resolution:** We discovered modern `setuptools` removed this legacy module. We resolved this by explicitly configuring our Render environment to use `PYTHON_VERSION 3.11.0` and pinning `setuptools<=80.10.2` in `requirements.txt`.
*   **React Strict Mode Compilation:** Integrating the hardware scanner triggered strict Vite TypeScript errors (`TS6133` unused variables) which halted the CI/CD pipeline. **Resolution:** We refactored the component to gracefully silence camera continuous-scan warnings without triggering unused parameter flags.
