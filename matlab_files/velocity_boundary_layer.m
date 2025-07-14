

clear; clc; close all

% Output folder for saving plots
save_folder = 'Blasius_Plots';
if ~exist(save_folder, 'dir')
    mkdir(save_folder);
end

% Varying parameters
nu_vals = [1e-5, 2e-5, 3e-5];  % Mercury, Water, Air [m^2/s]
U_inf_vals = [0.1, 0.15 , 0.20];  % [m/s]
x_vals = linspace(0.1,6.0, 200);  % [m]
y_vals = linspace(0, 0.25, 100);    % [m]
x_locs = linspace(0.5,4.5,10);       % [m]
arrow_scale = 0.8;

% Solve Blasius once
alpha_blasius = fzero(@(alpha) blasius_shooting(alpha), [0.3, 0.4]);
eta_span = [0 10];
F0 = [0 0 alpha_blasius];
[eta_sol, F_sol] = ode45(@blasius_rhs, eta_span, F0);
f = F_sol(:,1); fp = F_sol(:,2); fpp = F_sol(:,3);

% Loop over parameter combinations
for nu = nu_vals
    for U_inf = U_inf_vals

        [X, Y] = meshgrid(x_vals, y_vals);
        ETA = Y .* sqrt(U_inf ./ (nu .* X));

        u_grid = interp1(eta_sol, fp, ETA, 'linear', 'extrap');
        f_grid = interp1(eta_sol, f, ETA, 'linear', 'extrap');
        v_grid = 0.5 .* ETA .* u_grid - f_grid;
        delta_curve = 5 * sqrt(nu * x_vals / U_inf);
        % --- Horizontal profile plots at x locations ---
        for k = 1:length(x_locs)
            x0 = x_locs(k);
            u_prof = interp1(x_vals, u_grid', x0, 'linear')';  % Interpolate column at x0
            y_prof = y_vals;

            bl_idx = find(u_prof >= 0.99, 1);
            if isempty(bl_idx), bl_idx = length(u_prof); end
            u_bl = u_prof(1:bl_idx);
            y_bl = y_prof(1:bl_idx);

            fig = figure('Visible','off');
            contourf(x_vals, y_vals, u_grid, 40, 'LineColor', 'none')
            colormap()
            colorbar
            hold on
            plot(x_vals, delta_curve, 'r--', 'LineWidth', 2.2);  % Red dashed BL curve
text(x_vals(end)*0.85, delta_curve(end)*1.05, '\delta(x)', ...
     'Color', 'r', 'FontSize', 13, 'FontWeight', 'bold');
            for j = 1:4:length(y_bl)
                uy = u_bl(j);
                yy = y_bl(j);
                quiver(x0, yy, uy * arrow_scale, 0, 0, ...
                    'k', 'LineWidth', 1.4, 'MaxHeadSize', 0.01)  % Minimal arrowhead
            end
            plot(x0 + u_bl * arrow_scale, y_bl, 'b-', 'LineWidth', 2)
            text(x_vals(end)*0.85, delta_curve(end)*1.05, '\delta(x)','Color', 'r', 'FontSize', 13, 'FontWeight', 'bold');

            du_dy = (u_prof(2) - u_prof(1)) / (y_prof(2) - y_prof(1));
            slope_vec = [du_dy * arrow_scale, 1];
            slope_vec = slope_vec / norm(slope_vec) * 0.8;
            plot([x0, x0 + slope_vec(1)], [0, slope_vec(2)], ...
                'k-', 'LineWidth', 2.4)


            xlabel('x (m)'), ylabel('y (m)')
            title(sprintf('u/U_\\infty at x = %.2f m, \\nu = %.0e m^2/s, U_\\infty = %.2f m/s', ...
                x0, nu, U_inf))
            set(gca, 'FontSize', 13)

            fname = sprintf('u_x%.2f_nu%.0e_U%.2f.png', x0, nu, U_inf);
            saveas(fig, fullfile(save_folder, fname))
            close(fig)
        end

        % --- Vertical velocity contour ---
        fig = figure('Visible','off');
        set(fig, 'Units', 'inches', 'Position', [1, 1, 6, 4]);  % custom aspect ratio
        set(fig, 'PaperOrientation', 'landscape');
        set(fig, 'PaperUnits', 'inches');
        set(fig, 'PaperPosition', [0 0 6 4]);
        contourf(x_vals, y_vals, v_grid, 40, 'LineColor', 'none')
        colormap;
        colorbar;
        
        xlabel('x (m)'), ylabel('y (m)')
        title(sprintf('v/U_\\infty, \\nu = %.0e m^2/s, U_\\infty = %.2f m/s', nu, U_inf))
        set(gca, 'FontSize', 13)
        fname = sprintf('v_nu%.0e_U%.2f.png', nu, U_inf);
        saveas(fig, fullfile(save_folder, fname))
        close(fig)

        mu = 1;  % Assume unit dynamic viscosity for normalized result
        tau_w = mu * U_inf * alpha_blasius ./ sqrt(nu .* x_vals);
        
        fig = figure('Visible','off');
        plot(x_vals, tau_w, 'b-', 'LineWidth', 2)
        grid on
        xlabel('x (m)'), ylabel('\tau_w (Pa)')
        title(sprintf('Wall Shear Stress, \\nu = %.0e m^2/s, U_\\infty = %.2f m/s', nu, U_inf))
        ylim([0 80])  % <-- Adjust this upper limit as needed
        set(gca, 'FontSize', 13)
        fname = sprintf('tau_nu%.0e_U%.2f.png', nu, U_inf);
        saveas(fig, fullfile(save_folder, fname))
        close(fig)

    end
end

%% --- Functions ---
function dF = blasius_rhs(~, F)
    dF = zeros(3,1);
    dF(1) = F(2);
    dF(2) = F(3);
    dF(3) = -0.5 * F(1) * F(3);
end

function mismatch = blasius_shooting(alpha)
    eta_span = [0 10];
    F0 = [0 0 alpha];
    [~, F] = ode45(@blasius_rhs, eta_span, F0);
    mismatch = F(end,2) - 1;
end
