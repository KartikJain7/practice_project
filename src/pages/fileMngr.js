'use client'
import { DetailsView, FileManagerComponent, NavigationPane, Toolbar, Inject } from '@syncfusion/ej2-react-filemanager';

function App() {
 let   string = "https://ej2-aspcore-service.azurewebsites.net/";

  return (
    <div className="control-section">
        <FileManagerComponent id="file" view="LargeIcons"  >
          <Inject services={[ NavigationPane, DetailsView, Toolbar]} />
        </FileManagerComponent>
    </div>
  );
}
export default App;