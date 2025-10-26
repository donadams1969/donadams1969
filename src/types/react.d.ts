import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add our custom property to the existing HTMLAttributes interface
    valoraiplus_module_id?: string;
  }
}