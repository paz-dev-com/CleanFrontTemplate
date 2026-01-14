import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '@features/auth';

/**
 * Has Role Directive
 * Conditionally displays content based on user roles
 * Usage: *appHasRole="'Admin'"
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input() set appHasRole(role: string) {
    this.updateView(role);
  }

  private updateView(role: string): void {
    const user = this.authService.getCurrentUser();
    const hasRole = user?.hasRole(role) || false;

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
